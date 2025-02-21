import { useEffect, useState } from 'react';
import { Container, Grid } from '@mantine/core';
import '@mantine/core/styles.css';
import { useCartStore } from '../stores/useCartStore.js';
import { totalPriceWithDiscount, totalPriceWithoutDiscount } from '../utils/CartProductPrice.js';
import { FileText, ShoppingBag, Truck } from 'lucide-react';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees.js';
import { useAddressStore } from '../stores/useAddressStore.js';
import esewa from '../assets/esewa.png'
import AddressPage from '../components/AddressPage.jsx';
import { GenerateSignature } from '../utils/GenerateSignature.js';
import { useOrderStore } from '../stores/useOrderStore.js'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';

function CheckoutPage() {
    const { Address, getAddress } = useAddressStore();
    const {addOrders, setOrderData} = useOrderStore()
    const [selectedAddress, setSelectedAddress] = useState(null);
    const { cartProducts } = useCartStore();
    const navigate = useNavigate()
    const baseURL = import.meta.env.VITE_BACKEND_URL
    const transaction_uuid = Date.now().toString()

    useEffect(() => {
        getAddress()
    }, [])

    useEffect(() => {
        if (Address.length > 0) {
            setSelectedAddress(Address[0]);
        }
    }, [Address]);

    let total;
    const deliveryCharge = 25;
    const handlingCharge = 15;
    const priceWithDiscount = totalPriceWithDiscount(cartProducts)
    const priceWithoutDiscount = totalPriceWithoutDiscount(cartProducts)
    const saved = Number(priceWithoutDiscount.replace(/,/g, '')) - Number(priceWithDiscount.replace(/,/g, ''));
    if (Number(priceWithDiscount.replace(/,/g, '')) > 99) {
        total = Number(priceWithDiscount.replace(/,/g, '')) + handlingCharge;
    } else {
        total = Number(priceWithDiscount.replace(/,/g, '')) + handlingCharge + deliveryCharge;
    }

    function handleCOD() {
        if (!selectedAddress) {
            return toast.error("Please Select an Address First")
        }
        if (cartProducts.length == 0) {
            return toast.error("Cart is empty")
        }
        setOrderData(cartProducts, selectedAddress, "Cash On Delivery", total)
        addOrders();
        navigate('/')
    }
    function handleEsewa() {
        if (!selectedAddress) {
            return toast.error("Please Select an Address First")
        }
        if (cartProducts.length == 0) {
            return toast.error("Cart is empty")
        }
        setOrderData(cartProducts, selectedAddress,"Payed With Esewa", total)
        document.getElementById("esewaForm").submit();
    }

    return (
        <div className="min-h-[82vh] bg-gray-50 py-1">
            <Container size="lg">
                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <div className=''>
                        <AddressPage selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
                        </div>
                    </Grid.Col>

                    {/* Bill Details  */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <div className=''>
                            <div className="p-4 -mt-5 lg:mt-0 border-t">
                                <h2 className="font-semibold mb-2">Bill details</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <FileText size={15} />
                                            <span>Items total</span>
                                            {saved > 0 && (
                                                <span className="text-[9px] bg-blue-100 px-1 mt-1 rounded-md font-normal text-blue-600">Saved Rs.{saved}</span>
                                            )}
                                        </div>
                                        <div>
                                            {saved > 0 &&
                                                <span className="line-through text-gray-400 mr-2 text-sm">Rs.{priceWithoutDiscount}</span>
                                            }
                                            <span className='text-sm'>Rs.{priceWithDiscount}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-1">
                                            <Truck size={15} />
                                            <span>Delivery charge</span>
                                        </div>
                                        <div>
                                            {Number(priceWithDiscount.replace(/,/g, '')) > 99 ?
                                                <div>
                                                    <span className="line-through text-gray-400 mr-2">Rs.{deliveryCharge}</span>
                                                    <span className="text-green-600">FREE</span>
                                                </div>
                                                :
                                                <div>
                                                    <span>Rs.{deliveryCharge}</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-1">
                                            <ShoppingBag size={15} />
                                            <span>Handling charge</span>
                                        </div>
                                        <span>Rs.{handlingCharge}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t">
                                <div className=" px-3 py-1 mb-1 flex justify-between items-center font-semibold text-sm">
                                    <span>Grand total</span>
                                    <span>Rs.{DisplayPriceInRupees(total)}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl shadow-md">
                                {/* Esewa Payment Button */}
                                <p className='text-sm text-pretty'>For testing Esewa: <br />eSewa ID: 9806800001 Password/MPIN: 1122 Token/OTP:123456</p>
                                <form id="esewaForm" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
                                    <input type="hidden" name="amount" value={total} />
                                    <input type="hidden" name="tax_amount" value="0" />
                                    <input type="hidden" name="total_amount" value={total} />
                                    <input type="hidden" name="transaction_uuid" value={transaction_uuid} />
                                    <input type="hidden" name="product_code" value="EPAYTEST" />
                                    <input type="hidden" name="product_service_charge" value="0" />
                                    <input type="hidden" name="product_delivery_charge" value="0" />
                                    <input type="hidden" name="success_url" value={`${baseURL}/payment/esewa/success`} />
                                    <input type="hidden" name="failure_url" value={`${baseURL}/payment/esewa/failure`} />
                                    <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
                                    <input type="hidden" name="signature" value={GenerateSignature(`total_amount=${total},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`)} />
                                    <button type="button" onClick={handleEsewa} className="flex justify-center items-center w-full border-2 border-green-500 rounded-lg transition hover:bg-green-100">
                                        <img src={esewa} alt="eSewa" className="w-20 h-full object-contain" />
                                        <p>Pay with eSewa</p>
                                    </button>
                                </form>


                                {/* Cash on Delivery Button */}
                                <button
                                    size="sm"
                                    className="flex items-center justify-center gap-2 bg-gray-800 text-white hover:bg-gray-900 transition rounded-lg py-3"
                                >
                                    <Truck className="w-5 h-5" />
                                    <span onClick={handleCOD}>Cash on Delivery</span>
                                </button>
                            </div>
                        </div>

                    </Grid.Col>
                </Grid>


            </Container >
        </div >
    );
}

export default CheckoutPage

