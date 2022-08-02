import React from 'react'
import Link from 'next/link'
import Head from 'next/head'

export default function Navbar() {
  return (
    <>
    <div>
      <Head>
        <title>Auction DApp</title>
        <meta name="description" content="By priya" />
      </Head>
    <div> 
        <nav className="navbar navbar-expand-lg navbar-light bg-secondary fs-5">
        <a className="navbar-brand" href="#"></a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav nav-fill">
            <li className="nav-item active">
                <a className="nav-link  text-white" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
                <Link href='/addAuctionItem'>
                <a className="nav-link  text-white" href="#">Add Item</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href='fetchAuctionItem'>
                    <a className="nav-link  text-white" href="#">Bid</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href='/withdraw'>
                    <a className="nav-link  text-white" href="#">Withdraw</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href='/bidding_result'>
                    <a className="nav-link  text-white" href="#">Bid Result</a>
                </Link>
            </li>
            </ul>
        </div>
        </nav>
    </div>
    </div>
  </>
  )
}