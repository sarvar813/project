import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Hero from '../../components/Hero/Hero.jsx';
import SideInfo from '../../components/SideInfo/SideInfo.jsx';
import SpecialsCombo from '../../components/SpecialsCombo/SpecialsCombo.jsx';
import SauceShowcase from '../../components/SauceShowcase/SauceShowcase.jsx';
import MosaicGallery from '../../components/MosaicGallery/MosaicGallery.jsx';
import { useCart } from '../../context/CartContext.jsx';

import NewsParallax from '../../components/NewsParallax/NewsParallax.jsx';
import FeatureGrid from '../../components/FeatureGrid/FeatureGrid.jsx';
import Testimonials from '../../components/Testimonials/Testimonials.jsx';
import Stories from '../../components/Stories/Stories.jsx';
import AIAdvisor from '../../components/AIAdvisor/AIAdvisor.jsx';

import ComboSpecials from '../../components/ComboSpecials/ComboSpecials.jsx';
import DessertGrid from '../../components/DessertGrid/DessertGrid.jsx';
import Stats from '../../components/Stats/Stats.jsx';
import Newsletter from '../../components/Newsletter/Newsletter.jsx';
import LoyaltyLevels from '../../components/LoyaltyLevels/LoyaltyLevels.jsx';
import DeliveryProcess from '../../components/DeliveryProcess/DeliveryProcess.jsx';
import FAQ from '../../components/FAQ/FAQ.jsx';
import SubscriptionPlans from '../../components/SubscriptionPlans/SubscriptionPlans.jsx';
import LocationSection from '../../components/LocationSection/LocationSection.jsx';
import AppDownload from '../../components/AppDownload/AppDownload.jsx';
import Careers from '../../components/Careers/Careers.jsx';
import FlashDeals from '../../components/FlashDeals/FlashDeals.jsx';
import Reservation from '../../components/Reservation/Reservation.jsx';

const Home = () => {
    const { t } = useTranslation();
    const { isStoreOpen } = useCart();

    const revealVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="home-wrapper">
            {!isStoreOpen && (
                <div className="store-closed-banner">
                    <p>{t('home.store_closed', "Hozirda do'konimiz yopiq. Buyurtmalar qabul qilinmaydi.")}</p>
                </div>
            )}

            <motion.div initial="hidden" animate="visible" variants={revealVariants}>
                <Stories />
            </motion.div>

            <main className="main-content">
                <div className="hero-section">
                    <Hero />
                </div>
                <motion.div
                    className="side-section"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <SideInfo />
                </motion.div>
            </main>

            <div className="home-sections-wrapper">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealVariants}>
                    <SpecialsCombo />
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealVariants}>
                    <FlashDeals />
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealVariants}>
                    <ComboSpecials />
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealVariants}>
                    <SauceShowcase />
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealVariants}>
                    <Stats />
                </motion.div>

                <DeliveryProcess />

                <LoyaltyLevels />

                <AppDownload />

                <Reservation />

                <SubscriptionPlans />
            </div>

            <NewsParallax />

            <div className="home-sections-wrapper">
                {[FeatureGrid, DessertGrid, Careers, Testimonials, FAQ, MosaicGallery, Newsletter, AIAdvisor].map((Comp, idx) => (
                    <motion.div
                        key={idx}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={revealVariants}
                    >
                        <Comp />
                    </motion.div>
                ))}
            </div>

            <LocationSection />
        </div>
    );
};

export default Home;
