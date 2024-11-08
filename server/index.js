const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const MainCategoryRouter = require('./routers/MainCategoryRouter.js');
const SubCategoryRouter = require('./routers/SubCategoryRouter.js');
const BrandCategoryRouter = require('./routers/BrandCategoryRouter.js');
const ProductRouter = require('./routers/ProductRouter.js');
const AdminRouter = require('./routers/AdminRouter.js');
const CutomerRouter = require('./routers/CustomerRouter.js');
const CardsRouter = require('./routers/CardRouter.js');
const OrderRouter = require('./routers/OrdersRouter.js');
const walletRoutes = require('./routers/walletRouter.js');
const CartRouter = require('./routers/CartRouter.js');
const OffersRouter = require('./routers/OffersRouter.js');
const ReportsRouter = require('./routers/ReportsRouter.js');
const FavouriteRouter = require('./routers/FavouriteRouter.js');
const AddsRouter = require('./routers/AddsRouter.js');
const RolesRouter = require('./routers/RolesRouter.js');
const CouponsRouter = require('./routers/CouponRoutes.js');
const VisitersRouter = require('./routers/VistesRouter.js');
const UserLocatoin = require('./routers/UserLocatoin.js');
const ContactUs = require('./routers/Contact.js');
const path = require('path');
const initAssociations = require('./associations.js');
const  cluster = require( 'cluster');

dotenv.config();

const app = express();
const port = 3000;

// Use __dirname directly
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/uploads/images/products')));
app.use('/brands', express.static(path.join(__dirname, 'public/uploads/images/brands')));
app.use('/mcategory', express.static(path.join(__dirname, 'public/uploads/images/mainCategorys')));
app.use('/subcategory', express.static(path.join(__dirname, 'public/uploads/images/subcategory')));
app.use('/adds', express.static(path.join(__dirname, 'public/uploads/images/adds')));
app.use('/adminimage', express.static(path.join(__dirname, 'public/uploads/images/admins/userprofile')));
app.use('/custmoerprofile', express.static(path.join(__dirname, 'public/uploads/images/customers/userprofile')));
app.use('/offers', express.static(path.join(__dirname, 'public/uploads/images/offers')));

app.use('/api/main-category', MainCategoryRouter);
app.use('/api/sub-category', SubCategoryRouter);
app.use('/api/brand-category', BrandCategoryRouter);
app.use('/api/product', ProductRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/cards', CardsRouter);
app.use('/api/customer', CutomerRouter);
app.use('/api/order', OrderRouter);
app.use('/api/wallet', walletRoutes);
app.use('/api/cart', CartRouter);
app.use('/api/offers', OffersRouter);
app.use('/api/reports', ReportsRouter);
app.use('/api/favourite', FavouriteRouter);
app.use('/api/adds', AddsRouter);
app.use('/api/roles', RolesRouter);
app.use('/api/coupons', CouponsRouter);
app.use('/api/visiters', VisitersRouter);
app.use('/api/contactus', ContactUs);
app.use('/api/location', UserLocatoin);



// () => {
//     if(cluster.isMaster){
//         // Count the machine's CPUs
//         var cpuCount = require( 'os').cpus().length;
//         // Create a worker for each CPU
//         for (var i = 0; i < cpuCount; i++) {
//             cluster.fork();
//         }
    
//         cluster.on('exit', function(worker) {
//             console.log('worker ' + worker.id + ' died :(');
//             cluster.fork();
//         });
        
//     }else {
//         app.listen(port, () => console.log(`🔥 app fire on port ${port}! 🚀`));
//     }
    
// }


app.listen(port, () => console.log(`🔥 app fire on port ${port}! 🚀`));

