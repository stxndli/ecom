import {CardElement} from '@stripe/react-stripe-js';


function CardSection() {
  return (
    <label>
      Card details
      <CardElement className="StripeElement"/>
    </label>
  );
};

export default CardSection;