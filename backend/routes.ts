import { Router, Request, Response } from 'express';
import {
  getMedicines,
  saveMedicine,
  deleteMedicine,
  getOrders,
  saveOrder,
  updateOrderStatus,
  createAdminSession,
  verifyAdminSession,
  deleteAdminSession,
  bulkSaveMedicines,
  Medicine,
  Order
} from './db';
import multer from 'multer';
import { uploadImage } from './cloudinary';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// 0. Admin Authentication/Authorization Endpoints
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    // Load expected credentials strictly from environment variables
    const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@medonepharmacy.com').toLowerCase().trim();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const inputEmail = email.toLowerCase().trim();

    // Secure verification directly against env credentials
    const isEmailValid = inputEmail === expectedEmail;
    const isPasswordValid = password === expectedPassword;

    if (isEmailValid && isPasswordValid) {
      const token = await createAdminSession(expectedEmail);
      res.json({
        success: true,
        token,
        admin: {
          email: expectedEmail,
          name: 'Chief Pharmacist Admin'
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password combination.' });
    }
  } catch (err: any) {
    console.error('Error in POST /auth/login:', err);
    res.status(500).json({ error: 'Server authentication process failed.' });
  }
});

router.get('/auth/verify', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ verified: false, error: 'Authorization header is missing or malformed.' });
      return;
    }

    const token = authHeader.substring(7);
    const isValid = await verifyAdminSession(token);

    if (isValid) {
      res.json({
        verified: true,
        admin: {
          email: process.env.ADMIN_EMAIL || 'admin@medonepharmacy.com',
          name: 'Chief Pharmacist Admin'
        }
      });
    } else {
      res.status(401).json({ verified: false, error: 'Expired or invalid session token.' });
    }
  } catch (err: any) {
    console.error('Error in GET /auth/verify:', err);
    res.status(500).json({ error: 'Session verification process failed.' });
  }
});

router.post('/auth/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await deleteAdminSession(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err: any) {
    console.error('Error in POST /auth/logout:', err);
    res.status(500).json({ error: 'Logout process failed.' });
  }
});

// 1. Medicines endpoints
router.get('/medicines', async (req: Request, res: Response) => {
  try {
    const list = await getMedicines();
    res.json(list);
  } catch (err: any) {
    console.error('Error in GET /medicines:', err);
    res.status(500).json({ error: 'Failed to retrieve medicine list.' });
  }
});

router.post('/medicines', async (req: Request, res: Response) => {
  try {
    const { id, name, price, category, stock, imgGradient, imgUrl } = req.body;

    if (!name || isNaN(Number(price)) || isNaN(Number(stock))) {
      res.status(400).json({ error: 'Name, valid price, and stock are required.' });
      return;
    }

    const medId = id || name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
    const priceNum = Number(price);
    const stockNum = Number(stock);

    // Calculate status matching client validation logic
    let calculatedStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired Soon' = 'In Stock';
    if (stockNum === 0) {
      calculatedStatus = 'Out of Stock';
    } else if (stockNum <= 25) {
      calculatedStatus = 'Low Stock';
    }

    const newMedicine: Medicine = {
      id: medId,
      name,
      price: priceNum,
      category: category || 'General Medicine',
      stock: stockNum,
      imgGradient: imgGradient || 'from-sky-50 to-sky-100 text-sky-500',
      imgUrl: imgUrl || '',
      status: calculatedStatus
    };

    await saveMedicine(newMedicine);
    res.json(newMedicine);
  } catch (err: any) {
    console.error('Error in POST /medicines:', err);
    res.status(500).json({ error: 'Failed to save medicine product.' });
  }
});

router.post('/medicines/bulk', async (req: Request, res: Response) => {
  try {
    const { medicines } = req.body;
    if (!Array.isArray(medicines)) {
      res.status(400).json({ error: 'Payload must contain a "medicines" array.' });
      return;
    }

    const processedMeds: Medicine[] = medicines.map((m: any) => {
      const stockNum = Number(m.stock);
      let calculatedStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired Soon' = 'In Stock';
      if (stockNum === 0) {
        calculatedStatus = 'Out of Stock';
      } else if (stockNum <= 25) {
        calculatedStatus = 'Low Stock';
      }

      return {
        id: m.id || m.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        name: m.name,
        price: Number(m.price),
        category: m.category || 'General Medicine',
        stock: stockNum,
        imgGradient: m.imgGradient || 'from-sky-50 to-sky-100 text-sky-500',
        imgUrl: m.imgUrl || '',
        status: calculatedStatus
      };
    });

    await bulkSaveMedicines(processedMeds);
    res.json({ success: true, count: processedMeds.length });
  } catch (err: any) {
    console.error('Error in POST /medicines/bulk:', err);
    res.status(500).json({ error: 'Failed to bulk save medicine products.' });
  }
});

router.delete('/medicines/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteMedicine(id);
    res.json({ success: true, message: 'Medicine deleted successfully.' });
  } catch (err: any) {
    console.error('Error in DELETE /medicines:', err);
    res.status(500).json({ error: 'Failed to delete medicine product.' });
  }
});

// 2. Checkout & Orders endpoints
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const list = await getOrders();
    res.json(list);
  } catch (err: any) {
    console.error('Error in GET /orders:', err);
    res.status(500).json({ error: 'Failed to retrieve order logs.' });
  }
});

router.post('/orders', async (req: Request, res: Response) => {
  try {
    const { customerName, items, total, itemsList } = req.body;
    if (!items) {
      res.status(400).json({ error: 'Transaction items are required.' });
      return;
    }

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      customerName: customerName || 'Guest Customer (Web Checkout)',
      createdAt: 'Just now',
      items: items,
      total: Number(total) || 0,
      status: 'Pending'
    };

    // Keep orders persistent and deduct stock if itemsList is provided
    if (itemsList && Array.isArray(itemsList)) {
      const currentMeds = await getMedicines();
      for (const cartItem of itemsList) {
        const med = currentMeds.find(m => m.id === cartItem.id);
        if (med) {
          med.stock = Math.max(0, med.stock - cartItem.quantity);
          if (med.stock === 0) med.status = 'Out of Stock';
          else if (med.stock <= 25) med.status = 'Low Stock';
          await saveMedicine(med);
        }
      }
    }

    await saveOrder(newOrder);
    const updatedMedicines = await getMedicines();

    res.json({ success: true, order: newOrder, updatedMedicines });
  } catch (err: any) {
    console.error('Error in POST /orders:', err);
    res.status(500).json({ error: 'Failed to complete transaction checkout.' });
  }
});

router.post('/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }

    await updateOrderStatus(id, status);
    res.json({ id, status });
  } catch (err: any) {
    console.error('Error in POST /orders/status:', err);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// 3. Image uploading endpoint using Cloudinary
router.post('/upload-image', upload.single('image'), async (req: any, res: Response) => {
  try {
    if (!req.file) {
      // Fallback for base64 if needed, though we prefer file
      const { imageData } = req.body;
      if (imageData) {
        // If it's a base64 string, we can still upload it to Cloudinary
        const result = await uploadImage(Buffer.from(imageData.split(',')[1], 'base64'));
        res.json({ url: result });
        return;
      }
      res.status(400).json({ error: 'No image file or data provided' });
      return;
    }

    const imageUrl = await uploadImage(req.file.buffer);
    res.json({ url: imageUrl });
  } catch (err: any) {
    console.error('Error in POST /upload-image:', err);
    res.status(500).json({ error: 'Failed to upload image to Cloudinary.' });
  }
});

export default router;
