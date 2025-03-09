
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify'; // Import toast

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol, token, backendUrl } = useContext(AppContext); // Include token and backendUrl

    const [docInfo, setDocInfo] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [notification, setNotification] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false); // Add loading state
    const [location, setLocation] = useState('default'); // Add location state
    const navigate = useNavigate()

    const getUserLocation = async () => {
        try {
            // Using a free IP geolocation API
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (data.country_code === 'US') {
                return 'US';
            } else if (data.country_code === 'IN') {
                return 'INDIA';
            } else {
                return 'default';
            }
        } catch (error) {
            console.error('Error detecting location:', error);
            return 'default'; // Fallback
        }
    };

    // Price configuration based on location
    const priceConfig = {
        US: {
            basic: 100,
            standard: 150,
            premium: 200,
            Extra: 10,
            Extended: 25,
            Urgent: 30
        },
        INDIA: {
            basic: 3000,
            standard: 5000,
            premium: 7500,
            Extra: 500,
            Extended: 1500,
            Urgent: 2000
        },
        default: {
            basic: 100,
            standard: 150,
            premium: 200,
            Extra: 10,
            Extended: 25,
            Urgent: 30
        }
    };

    // Add effect to detect location
    useEffect(() => {
        const detectLocation = async () => {
            try {
                const userLocation = await getUserLocation();
                setLocation(userLocation);
            } catch (error) {
                console.error("Failed to get location:", error);
                setLocation('default');
            }
        };

        detectLocation();
    }, []);

    // Get location-specific prices
    const getLocationPrice = (basePriceKey) => {
        return priceConfig[location]?.[basePriceKey] || priceConfig.default[basePriceKey];
    };

    const plans = [
        {
            name: 'Basic',
            title: 'Basic Review (Asynchronous)',
            subtitle: 'No Live Consultation',
            emoji: '📋',
            priceUSD: getLocationPrice('basic'), // Use location-based price
            features: [
                { text: 'Review up to 5 pages of reports', included: true },
                { text: 'Written summary with key insights', included: true },
                { text: 'General recommendations (no treatment plan)', included: true },
                { text: 'WhatsApp voice note explanation', included: false },
                { text: 'Up to 3 follow-up text queries (within 48 hours)', included: false },
            ],
        },
        {
            name: 'Standard',
            title: 'Standard Review',
            subtitle: 'With WhatsApp Voice Note',
            emoji: '🎙',
            priceUSD: getLocationPrice('standard'), // Use location-based price
            features: [
                { text: 'Review up to 10 pages of reports', included: true },
                { text: 'Summary + WhatsApp voice note explanation', included: true },
                { text: 'Up to 3 follow-up text queries (within 48 hours)', included: true },
                { text: 'Written summary with key insights', included: true },
                { text: 'General recommendations (no treatment plan)', included: true },
                { text: 'Live video call', included: false },
            ],
        },
        {
            name: 'Comprehensive',
            title: 'Comprehensive Review',
            subtitle: 'With Live Video Call',
            emoji: '📹',
            tag: 'POPULAR',
            priceUSD: getLocationPrice('premium'), // Use location-based price
            features: [
                { text: 'Review up to 15 pages of reports', included: true },
                { text: 'Up to 3 follow-up text queries (within 48 hours)', included: true },
                { text: 'Summary & general recommendations', included: true },
                { text: 'Written summary with key insights', included: true },
                { text: 'General recommendations (no treatment plan)', included: true },
                { text: 'WhatsApp voice note explanation', included: true },
                { text: 'Live 20-minute WhatsApp/Zoom consultation', included: true }
            ],
        },
    ];


    const addons = [
        { name: 'extra-pages', label: 'Additional Pages Review', description: 'Add up to 5 extra pages', priceUSD: getLocationPrice('Extra'), iconClass: 'fas fa-file-medical' },
        { name: 'extended-call', label: 'Extended Consultation', description: 'Add 15 minutes to your call', priceUSD: getLocationPrice('Extended'), iconClass: 'fas fa-clock' },
        { name: 'urgent-review', label: 'Urgent Review', description: 'Get your results within 24 hours', priceUSD: getLocationPrice('Urgent'), iconClass: 'fas fa-bolt' },
    ];

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId);
        setDocInfo(docInfo);
    };

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo();
        }
    }, [doctors, docId]);

    // Handle plan selection and add to cart
    const handlePlanSelect = (plan) => {
        // If a plan is already selected, remove it from cart
        if (selectedPlan) {
            setCartItems(prevItems => prevItems.filter(item => item.name !== selectedPlan.name));
        }

        // Set the new plan
        setSelectedPlan(plan);

        // Add the new plan to cart
        setCartItems(prevItems => {
            // Filter out any previous plan
            const itemsWithoutPlans = prevItems.filter(item =>
                !plans.some(p => p.name === item.name)
            );
            // Add the new plan
            return [...itemsWithoutPlans, plan];
        });

        setNotification({ type: 'success', message: `${plan.name} plan added!` });
        setTimeout(() => setNotification(null), 3000);
    };

    // Handle add-on toggle
    const handleAddonToggle = (addon) => {
        if (!selectedPlan) {
            setNotification({ type: 'info', message: 'Please select a plan first.' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        // Check if addon is already selected
        const isAddonSelected = selectedAddons.some(a => a.name === addon.name);

        if (isAddonSelected) {
            // Remove addon from selected list and cart
            setSelectedAddons(prevAddons => prevAddons.filter(a => a.name !== addon.name));
            setCartItems(prevItems => prevItems.filter(item => item.name !== addon.name));
            setNotification({ type: 'info', message: `${addon.label} removed!` });
        } else {
            // Add addon to selected list and cart
            setSelectedAddons(prevAddons => [...prevAddons, addon]);
            setCartItems(prevItems => [...prevItems, addon]);
            setNotification({ type: 'info', message: `${addon.label} added!` });
        }

        setTimeout(() => setNotification(null), 3000);
    };

    // Remove item from cart
    const removeItemFromCart = (itemToRemove) => {
        // Check if we're removing a plan
        const isPlan = plans.some(plan => plan.name === itemToRemove.name);

        if (isPlan) {
            // If removing a plan, clear plan and all addons
            setSelectedPlan(null);
            setSelectedAddons([]);
            setCartItems([]);
            setNotification({ type: 'info', message: 'Plan removed. All add-ons have been removed as well.' });
        } else {
            // If removing an addon, just remove that addon
            setCartItems(prevItems => prevItems.filter(item => item.name !== itemToRemove.name));
            setSelectedAddons(prevAddons => prevAddons.filter(addon => addon.name !== itemToRemove.name));
            setNotification({ type: 'info', message: `${itemToRemove.label} removed.` });
        }

        setTimeout(() => setNotification(null), 3000);
    };

    // Clear the entire cart
    const clearCart = () => {
        setCartItems([]);
        setSelectedPlan(null);
        setSelectedAddons([]);
        setNotification({ type: 'info', message: 'Cart cleared.' });
        setTimeout(() => setNotification(null), 3000);
    };

    // Calculate total price
    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.priceUSD, 0);
    };

    // Format price with currency symbol
    const formatPrice = (price) => {
        return `${currencySymbol(location)}${price}`;
    };

    // Check if addon is selected
    const isAddonSelected = (addon) => selectedAddons.some(a => a.name === addon.name);

    // Razorpay Payment
    const handleRazorpayPayment = async () => {
        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        setPaymentLoading(true);
        try {
            const totalPrice = calculateTotal();  // Get the total price
            const appointmentData = {  // Create a payload to send to your backend
                amount: totalPrice
            };

            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', appointmentData, { headers: { token } });
            if (data.success) {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: data.order.amount,
                    currency: data.order.currency,
                    name: 'Consultation Payment',
                    description: 'Payment for consultation',
                    order_id: data.order.id,
                    handler: async (response) => {
                        // Payment verification
                        try {
                            const verificationData = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, {
                                headers: { token },
                            });

                            if (verificationData.data.success) {
                                toast.success('Payment successful!');
                                clearCart();
                                // Redirect or update UI as needed
                            } else {
                                toast.error('Payment verification failed.');
                            }
                        } catch (error) {
                            console.error('Razorpay verification error:', error);
                            toast.error('Payment verification failed.');
                        } finally {
                            setPaymentLoading(false);
                        }
                    },
                    prefill: {
                        name: docInfo.name,
                        email: '', // Optionally prefill user's email
                        contact: '' // Optionally prefill user's contact
                    },
                    theme: {
                        color: '#3498db' // Customize theme color
                    }
                };

                const razor = new window.Razorpay(options);
                razor.open();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Razorpay error:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };

    // Stripe Payment
    const handleStripePayment = async () => {
        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }
        setPaymentLoading(true);
        try {
            const totalPrice = calculateTotal(); // Get the total price
            const appointmentData = {
                amount: totalPrice  // Total amount
            };
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', appointmentData, {  // Call your backend API
                headers: { token },
            });

            if (data.success) {
                window.location.href = data.session_url; // Redirect to Stripe checkout
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Stripe error:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };




    // Render feature list items
    const renderFeature = (feature) => {
        return (
            <li key={feature.text} className="flex items-center py-1.5">
                {feature.included ? (
                    <span className="text-green-600 mr-2 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </span>
                ) : (
                    <span className="text-red-500 mr-2 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </span>
                )}
                <span className="text-sm text-gray-700">{feature.text}</span>
            </li>
        );
    };

    return docInfo ? (
        <div className="container mx-auto px-4 pb-16 max-w-6xl">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-md shadow-lg z-50 flex items-center max-w-md w-full ${notification.type === 'success' ? 'bg-green-100 border-l-4 border-green-600 text-green-800' :
                    'bg-blue-100 border-l-4 border-blue-600 text-blue-800'
                    }`} role="alert">
                    <div className="flex-shrink-0 mr-3">
                        {notification.type === 'success' ? (
                            <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <p>{notification.message}</p>
                </div>
            )}

            {/* Doctor Details */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img
                            className="w-full h-auto object-cover md:w-72 md:h-72" /* Modified class */
                            src={docInfo.image}
                            alt={docInfo.name}
                        />
                    </div>
                    <div className="p-8">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-800">{docInfo.name}</h1>
                            <img className="w-5 h-5 ml-2" src={assets.verified_icon} alt="Verified" />
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <p className="text-gray-700">
                                {docInfo.degree} - {docInfo.speciality}
                            </p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)', color: '#3498db' }}>
                                {docInfo.experience}
                            </span>
                        </div>

                        <div className="mt-4">
                            <h3 className="flex items-center gap-1 text-lg font-medium text-gray-800">
                                About <img className="w-3" src={assets.info_icon} alt="" />
                            </h3>
                            <p className="mt-2 text-gray-600">
                                {docInfo.about}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mt-12 flex flex-col md:flex-row md:space-x-8"> {/* Modified to flex-col on small screens */}
                <div className="md:w-2/3">
                    {/* Plans Section */}
                    <section>
                        <div className="flex items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Choose Your Consultation Plan</h2>
                            <div className="flex-grow border-t border-gray-300 ml-4"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> {/* Modified grid for responsiveness */}
                            {plans.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${selectedPlan === plan
                                        ? 'border-2 border-blue-500 ring-4 ring-blue-100'
                                        : 'border border-gray-200'
                                        }`}
                                    style={{
                                        borderColor: selectedPlan === plan ? '#3498db' : '',
                                        boxShadow: selectedPlan === plan ? '0 0 0 4px rgba(52, 152, 219, 0.2)' : ''
                                    }}
                                >
                                    {/* Popular tag positioned above the title */}
                                    {plan.tag && (
                                        <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center text-sm font-medium py-1">
                                            {plan.tag}
                                        </div>
                                    )}
                                    <div className={`p-6 ${plan.tag ? 'pt-8' : ''}`}>
                                        {/* Updated: Emoji at top with title below */}
                                        <div className="text-center mb-4">
                                            <div className="text-5xl mb-2">{plan.emoji}</div>
                                            <h3 className="text-xl font-bold text-gray-800">{plan.title}</h3>
                                            <p className="text-gray-600 text-sm">{plan.subtitle}</p>
                                        </div>

                                        <ul className="space-y-2 my-6">
                                            {plan.features.map((feature) => renderFeature(feature))}
                                        </ul>

                                        <div className="mt-auto pt-4 border-t border-gray-200">
                                            {/* Centered price */}
                                            <div className="flex justify-center items-center mb-3">
                                                <span className="text-3xl font-bold text-gray-800">{formatPrice(plan.priceUSD)}</span>
                                            </div>
                                            <button
                                                className="w-full py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-white"
                                                style={{
                                                    backgroundColor: selectedPlan === plan ? '#3498db' : '#3498db',
                                                    opacity: selectedPlan === plan ? 0.9 : 1
                                                }}
                                                onClick={() => handlePlanSelect(plan)}
                                            >
                                                {selectedPlan === plan ? 'Selected' : 'Select Plan'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Add-ons Section with red highlight effect */}
                    <section className="mt-12">
                        <div className="flex items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Enhance Your Consultation</h2>
                            <div className="flex-grow border-t border-gray-300 ml-4"></div>
                        </div>

                        <div className="space-y-4">
                            {addons.map((addon) => (
                                <div
                                    key={addon.name}
                                    className={`relative rounded-lg border transition-all duration-200 cursor-pointer ${!selectedPlan
                                        ? 'opacity-50 border-gray-200 bg-gray-50'
                                        : isAddonSelected(addon)
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                                        }`}
                                    style={{
                                        borderColor: isAddonSelected(addon) ? '#e74c3c' : '',
                                        backgroundColor: isAddonSelected(addon) ? 'rgba(231, 76, 60, 0.05)' : ''
                                    }}
                                    onClick={() => handleAddonToggle(addon)}
                                >
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isAddonSelected(addon) ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                                                }`} style={{
                                                    backgroundColor: isAddonSelected(addon) ? 'rgba(231, 76, 60, 0.2)' : '',
                                                    color: isAddonSelected(addon) ? '#e74c3c' : ''
                                                }}>
                                                <i className={`${addon.iconClass} text-lg`}></i>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-800">{addon.label}</h3>
                                                <p className="text-sm text-gray-600">{addon.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-lg font-semibold text-gray-800 mr-4">{formatPrice(addon.priceUSD)}</span>
                                            {isAddonSelected(addon) && (
                                                <span className="flex-shrink-0 text-red-600" style={{ color: '#e74c3c' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Checkout Summary (Cart) */}
                <div className="w-full md:w-1/3 mt-12 md:mt-0"> {/* Made cart full-width on small screens */}
                    <div className="bg-white rounded-lg shadow-md sticky top-8">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Consultation Summary</h2>

                            {cartItems.length === 0 ? (
                                <div className="py-8 text-center border-t border-b border-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="mt-4 text-gray-600">Your cart is empty.</p>
                                    <p className="text-sm text-gray-500">Select a plan to get started.</p>
                                </div>
                            ) : (
                                <>
                                    <ul className="divide-y divide-gray-200">
                                        {cartItems.map((item) => (
                                            <li key={item.name} className="py-4 flex justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-800 flex items-center">
                                                        <span className="mr-2">{item.emoji || ''}</span> {item.title || item.label}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{item.subtitle || item.description}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-medium text-gray-800 mr-3">{formatPrice(item.priceUSD)}</span>
                                                    <button
                                                        onClick={() => removeItemFromCart(item)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="py-4 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-gray-800">Total</span>
                                            <span className="text-2xl font-bold text-gray-800">{formatPrice(calculateTotal())}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3">

                                        <button
                                            className="w-full text-white font-bold py-3 px-4 rounded-md shadow transition-colors duration-200 flex items-center justify-center"
                                            style={{ backgroundColor: '#3498db' }}
                                            onClick={handleStripePayment}
                                            disabled={paymentLoading}
                                        >
                                            {paymentLoading ? 'Processing...' : 'Pay with Stripe'} <img className='max-w-20 max-h-5 ml-2' src={assets.stripe_logo} alt="" />
                                        </button>

                                        <button
                                            className="w-full text-white font-bold py-3 px-4 rounded-md shadow transition-colors duration-200 flex items-center justify-center"
                                            style={{ backgroundColor: '#3498db' }}
                                            onClick={handleRazorpayPayment}
                                            disabled={paymentLoading}
                                        >
                                            {paymentLoading ? 'Processing...' : 'Pay with Razorpay'}   <img className='max-w-20 max-h-5 ml-2' src={assets.razorpay_logo} alt="" />
                                        </button>

                                        <button
                                            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-md shadow-sm transition-colors duration-200"
                                            onClick={clearCart}
                                        >
                                            Clear Cart
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" style={{ borderColor: '#3498db' }}></div>
        </div>
    );
};

export default Appointment;