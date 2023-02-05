import React, { useState, useEffect } from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Moment from 'react-moment';
import moment from 'moment';
import Lottie from 'react-lottie';
import food from './food.json';

function App() {
  const [cartValue, setCartValue] = useState('')
  const [cartSurcharge, setCartSurcharge] = useState(0)
  const [deliveryDistance, setDeliveryDistance] = useState('')
  const [deliverySurcharge, setDeliverySurcharge] = useState(0)
  const [itemAmount, setItemAmount] = useState('')
  const [itemSurcharge, setItemSurcharge] = useState(0)
  const [finalFee, setFinalFee] = useState('')
  const [timeDate, setTimeDate] = useState('')

  useEffect(() => {
    console.log(finalFee)
    checkRushHour(cartValue, deliveryDistance, itemAmount, cartSurcharge, deliverySurcharge, itemSurcharge, finalFee)
  }, [cartValue, deliveryDistance, itemAmount, cartSurcharge, deliverySurcharge, itemSurcharge, finalFee])

  const handleClick = (event) => {
    event.preventDefault()
    handleCartValue(cartValue)
    handleDeliveryDistance(deliveryDistance)
    handleItemAmount(itemAmount)
    checkRushHour()
  }

  const checkRushHour = (cartValue, deliveryDistance, itemAmount, cartSurcharge, deliverySurcharge, itemSurcharge) => {
    setFinalFee(15)
    console.log(moment(timeDate).day())
    console.log(moment(timeDate).format("HH"))
    // if (timeDate.getDay() === 5 && (timeDate.getHours() >= 15 && timeDate.getHours() <= 19)) {
    if (moment(timeDate).day() === 5 && (moment(timeDate).format("HH") >= 15 && moment(timeDate).format("HH") <= 19)) {
      let feeWithRushHour = (parseInt(deliverySurcharge) + parseFloat(itemSurcharge) + parseFloat(cartSurcharge)) * 1.2
      console.log('rush hr fee ', feeWithRushHour, deliverySurcharge, itemSurcharge, cartSurcharge)
      console.log('rush hr values ', feeWithRushHour, deliveryDistance, itemAmount, cartValue)
      if (feeWithRushHour > 15) {
        setFinalFee(15)
      } else {
        console.log('final fee ', feeWithRushHour)
        setFinalFee(parseFloat(feeWithRushHour).toFixed(2))
      }
    } else {
      let feeWithoutRushHour = parseInt(deliverySurcharge) + parseFloat(itemSurcharge) + parseFloat(cartSurcharge)
      console.log(' no rush hr fee ', feeWithoutRushHour, deliverySurcharge, itemSurcharge, cartSurcharge)
      console.log(' no rush hr values ', deliveryDistance, itemAmount, cartValue)
      if (feeWithoutRushHour > 15) {
        setFinalFee(15)
      } else {
        console.log('final fee ', feeWithoutRushHour)
        setFinalFee(parseFloat(feeWithoutRushHour).toFixed(2))
      }
    }
  }

  const handleCartInput = (event) => {
    setCartValue(event.target.value)
  }

  const handleDeliveryDistanceInput = (event) => {
    setDeliveryDistance(event.target.value)
  }

  const handleItemAmountInput = (event) => {
    console.log(event.target.value, ' items')
    setItemAmount(event.target.value)
  }

  const handleCartValue = (cartValue) => {
    console.log('HANDLING CART')
    //handle surcharge for value less than 10 (difference between value and 10)
    if (cartValue < 10) {
      console.log('ca', cartValue)
      let difference = 10 - parseFloat(cartValue)
      setCartSurcharge(difference)
    } else if (cartValue >= 100) {
      console.log('cb')
      setCartSurcharge(0)
    }
  }

  const handleDeliveryDistance = (deliveryDistance) => {
    console.log('HANDLING DISTANCE')
    //delivery distance 2€ for first 1000m and 1€ for every 500m
    if (deliveryDistance > 1000 && deliveryDistance < 7501 && cartValue < 100) {
      console.log('a')
      let differenceDistance = parseInt(deliveryDistance) - 1000
      let deliveryFeeAdditional = parseInt(differenceDistance) / 500
      let finalDeliveryFee = Math.ceil(deliveryFeeAdditional) + 2
      setDeliverySurcharge(finalDeliveryFee)
    } else if (deliveryDistance <= 1000 && cartValue < 100) {
      console.log('b')
      setDeliverySurcharge(2)
    } else if (deliveryDistance > 7500 && cartValue < 100) {
      console.log('c')
      setDeliverySurcharge(15)
    } else if (cartValue >= 100) {
      console.log('d')
      setDeliverySurcharge(0)
    }
  }

  const handleItemAmount = (itemAmount) => {
    console.log('HANDLING ITEM AMOUNT ', itemAmount)
    //more than 5 items, 50 cents surcharge
    if (itemAmount > 4 && itemAmount < 13 && cartValue < 100) {
      let surcharge = handleItemSurcharge(itemAmount)
      setItemSurcharge(surcharge)
    } else if (itemAmount > 12 && cartValue < 100) {
      let surcharge = handleItemSurcharge(itemAmount) + 1.20
      setItemSurcharge(surcharge)
    } else if (cartValue >= 100) {
      setItemSurcharge(0)
    }
  }

  const handleItemSurcharge = (amountItems) => {
    let surcharge = 0
    let extraItemAmount = parseInt(amountItems) - 4
    surcharge = parseInt(extraItemAmount) * 0.50
    return surcharge
  }

  const clearValues = () => {
    console.log('to clear')
    setCartValue('')
    setDeliveryDistance('')
    setItemAmount('')
    // setFinalFee('')
    setCartSurcharge(0)
    setDeliverySurcharge(0)
    setItemSurcharge(0)
    setTimeDate('')
  }

  const foodOptions = {
    loop: true,
    autoplay: true,
    animationData: food,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="main">
      <div className="formUI">
        <p style={{ textAlign: 'center' }}>DELIVERY FEE CALCULATOR</p>
        <div className="container">
          <div className="values-row">
            <Form onSubmit={handleClick}>
              <Form.Group>
                <Form.Label>Cart Value:</Form.Label>
                <Form.Control value={cartValue} onChange={handleCartInput} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Delivery Distance:</Form.Label>
                <Form.Control value={deliveryDistance} onChange={handleDeliveryDistanceInput} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Amount of Items:</Form.Label>
                <Form.Control value={itemAmount} onChange={handleItemAmountInput} required />
              </Form.Group>

              <Form.Group>
                <Form.Label>Date and Time:</Form.Label>
                <DatePicker
                  showTimeSelect
                  className="datepickerStyle"
                  placeholderText="Select date"
                  selected={timeDate}
                  onChange={(date) => setTimeDate(date)}
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              </Form.Group>
              <Button variant="primary" style={{ display: 'flex', margin: '25px' }} type="submit"> CALCULATE DELIVERY PRICE</Button>
            </Form>
          </div>
          <div className="delivery-row">
            <Lottie
              options={foodOptions}
              height={155}
              width={180} />

            <p> DELIVERY PRICE:</p>
            <p style={{ fontSize: 69 }}>{finalFee}</p>
            <Button variant="warning" type="button" onClick={clearValues}> CLEAR VALUES </Button>
          </div>
        </div>
      </div >
    </div >
  );
}

export default App;

{/* <InputGroup className="mb-3">
        <InputGroup.Text id="cart-value">Cart Value</InputGroup.Text>
        <Form.Control
          placeholder="Cart Value"
          aria-label="Cart Value"
          aria-describedby="cart-value"
          value={cartValue}
          onChange={handleCartInput}
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text id="delivery-distance">Delivery Distance</InputGroup.Text>
        <Form.Control
          placeholder="Delivery Distance"
          aria-label="Delivery Distance"
          aria-describedby="delivery-distance"
          value={deliveryDistance}
          onChange={handleDeliveryDistanceInput}
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text id="amount-items">Amount of Items</InputGroup.Text>
        <Form.Control
          placeholder="Amount of Items"
          aria-label="Amount of Items"
          aria-describedby="amount-items"
          value={itemAmount}
          onChange={handleItemAmountInput}
        />
      </InputGroup>

      <p>TIME</p>
      <DatePicker
        showTimeSelect
        className="datepickerStyle"
        placeholderText="Select date"
        selected={timeDate}
        onChange={(date) => setTimeDate(date)}
        timeFormat="HH:mm"
        timeIntervals={30}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
      />

      <Button variant="primary" type="submit" onClick={handleClick}> CALCULATE DELIVERY PRICE BUTTON </Button> */}