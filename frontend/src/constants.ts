export const CONTACT_CONFIG = {
    phone: '+92 328 5154210',
    whatsapp: '923285154210',
    email: 'haseebabid950@gmail.com',
    address: 'Dharampura Bazar, Lahore, PK',
    whatsappUrl: (msg: string = '') =>
        `https://wa.me/923285154210${msg ? `?text=${encodeURIComponent(msg)}` : ''}`
};
