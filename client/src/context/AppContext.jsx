import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])

    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})

  // Fetch Seller Status
  const fetchSeller = async ()=>{
    try {
        const {data} = await axios.get('/api/seller/is-auth');
        if(data.success){
            setIsSeller(true)
        }else{
            setIsSeller(false)
        }
    } catch (error) {
        setIsSeller(false)
    }
  }

    // Fetch User Auth Status , User Data and Cart Items
const fetchUser = async ()=>{
    try {
        const {data} = await axios.get('api/user/is-auth');
        if (data.success){
            setUser(data.user)
            setCartItems(data.user.cartItems || {})
        }
    } catch (error) {
        setUser(null)
    }
}



    // Fetch All Products
    const fetchProducts = async ()=>{
        try {
            const { data } = await axios.get('/api/product/list')
            if(data.success){
                // normalize backend product id -> id for compatibility; keep legacy _id if present
                const normalized = data.products.map(p => ({ ...p, id: p.id || p._id }))
                setProducts(normalized)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

// Add Product to Cart
const addToCart = (itemId)=>{
    let cartData = structuredClone(cartItems);

    if(cartData[itemId]){
        cartData[itemId] += 1;
    }else{
        cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart")
}

  // Update Cart Item Quantity
  const updateCartItem = (itemId, quantity)=>{
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData)
    toast.success("Cart Updated")
  }

// Remove Product from Cart
const removeFromCart = (itemId)=>{
    let cartData = structuredClone(cartItems);
    if(cartData[itemId]){
        cartData[itemId] -= 1;
        if(cartData[itemId] === 0){
            delete cartData[itemId];
        }
    }
    toast.success("Removed from Cart")
    setCartItems(cartData)
}

  // Get Cart Item Count
  const getCartCount = ()=>{
    let totalCount = 0;
    for(const item in cartItems){
        totalCount += cartItems[item];
    }
    return totalCount;
  }

// Get Cart Total Amount
const getCartAmount = () =>{
    let totalAmount = 0;
    for (const items in cartItems){
        let itemInfo = products.find((product)=> (product._id || product.id) === items);
        if(!itemInfo) continue;
        if(cartItems[items] > 0){
            const price = itemInfo.offerPrice ?? itemInfo.offerPrice === 0 ? itemInfo.offerPrice : itemInfo.price || 0
            totalAmount += price * cartItems[items]
        }
    }
    return Math.floor(totalAmount * 100) / 100;
}


    useEffect(()=>{
        // If token saved in localStorage (fallback to cookie), set Authorization header
        const token = localStorage.getItem('token')
        if(token){
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        fetchUser()
        fetchSeller()
        fetchProducts()
    },[])

    // Clean up cart items that don't match any existing product id when products load
    useEffect(()=>{
        if(products.length === 0) return;
        const productIds = new Set(products.map(p => p.id || p._id));
        const cleaned = {};
        let changed = false;
        for(const key in cartItems){
            if(productIds.has(key)){
                cleaned[key] = cartItems[key];
            } else {
                changed = true;
            }
        }
        if(changed){
            setCartItems(cleaned)
        }
    }, [products])

    // Update Database Cart Items
    useEffect(()=>{
        const updateCart = async ()=>{
            try {
                const { data } = await axios.post('/api/cart/update', {cartItems})
                if (!data.success){
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }

        if(user){
            updateCart()
        }
    },[cartItems])

    const value = {navigate, user, setUser, setIsSeller, isSeller,
        showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeFromCart, cartItems, searchQuery, setSearchQuery, getCartAmount, getCartCount, axios, fetchProducts, setCartItems
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}
