import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <section className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-black text-white overflow-hidden rounded-3xl md:rounded-[48px] mx-4 md:mx-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-8 items-center">
        {/* Left: copy */}
        <div className="space-y-4 md:pr-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Fresh groceries, delivered fast
          </h1>
          <p className="text-sm sm:text-base text-white/90 max-w-xl">
            Handpicked produce, everyday low prices, and same-day delivery. Shop farm-fresh
            groceries for your family — fast, simple and reliable.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-white text-emerald-700 px-6 py-3 font-semibold shadow hover:brightness-95"
              aria-label="Shop Fresh">
              Shop Fresh
            </Link>

            <Link 
              to="/products"
              className="inline-flex items-center justify-center rounded-full border border-white/30 text-white px-5 py-3 font-medium hover:bg-white/10"
              aria-label="See Offers">
              See Offers
            </Link>
          </div>

          <ul className="mt-6 flex gap-6 text-sm">
            <li className="flex items-center gap-2 opacity-95">
              <img src={assets.leaf_icon} alt="farm fresh" className="h-5 w-5" />
              Farm-fresh
            </li>
            <li className="flex items-center gap-2 opacity-95">
              <img src={assets.coin_icon} alt="great prices" className="h-5 w-5" />
              Great prices
            </li>
            <li className="flex items-center gap-2 opacity-95">
              <img src={assets.delivery_truck_icon} alt="fast delivery" className="h-5 w-5" />
              Fast delivery
            </li>
          </ul>
        </div>

        {/* Right: offer card (replaces image) */}
        <div className="flex justify-center md:justify-end">
          <div className="relative">
            <div className="bg-black/60 rounded-3xl p-6 md:p-8 shadow-2xl transform transition hover:-translate-y-1 w-72 md:w-96 h-56 md:h-64 flex flex-col justify-center items-start gap-3">
              <span className="inline-block bg-emerald-600/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">
                Limited time
              </span>

              <h3 className="text-lg md:text-2xl font-bold">Exclusive Online Offer</h3>
              <p className="text-sm text-white/80 max-w-xs">Get up to <span className="text-emerald-300 font-extrabold">25% off</span> on selected groceries. Automatic at checkout.</p>

              <div className="mt-2">
                <Link to="/products" className="inline-flex items-center gap-2 bg-emerald-400 text-neutral-900 px-4 py-2 rounded-full font-semibold shadow-md">
                  Grab Offer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainBanner
