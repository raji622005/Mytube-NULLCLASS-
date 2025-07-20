import React, { useState } from 'react';
import './Plans.css';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import img1 from '../pages/Bronze.png';
import img2 from '../pages/Silver.png';
import img3 from '../pages/Gold.png';
import { db, auth } from '../firebase';
import emailjs from 'emailjs-com';
import { useSelector } from 'react-redux';
const Plans = () => {
  const [news1, setnews1] = useState('');
  const [news2, setnews2] = useState('');
  const [news3, setnews3] = useState('');
  const user = useSelector((state) => state.auth.user);
  const sendInvoice = async ( user_email,user_name, plan, amount) => {
    try {
      await emailjs.send(
        'service_ymfg3pf', // replace with your EmailJS service ID
        'template_qrrgjcf', // replace with your EmailJS template ID
        {
          
          user_email:user?.email,
          user_name: user?.name,
          plan: plan,
          amount: amount,
          date: new Date().toLocaleString()
        },
        'gRV9KTfYsweOQxnPf' 
        // replace with your EmailJS public key
      );
      console.log("Invoice email sent.");
      
    } catch (error) {
      console.error("Failed to send invoice:");
    }
  };

  const Plan = async (plan) => {
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to subscribe.");
      return;
    }

    const planPrices = {
      Bronze: 10,
      Silver: 50,
      Gold: 100
    };

    if (plan !== "Free") {
      const confirmed = window.confirm(`Simulate payment of ₹${planPrices[plan]} for ${plan} plan?`);
      if (!confirmed) return;
    }

    const uid = user.uid;
    const userRef = doc(db, "users", uid);

    try {
      const docSnap = await getDoc(userRef);
      const userData = docSnap.data();
      const currentSubscription = userData?.subscription?.plan;

      if (currentSubscription === plan) {
        alert(`You are already subscribed to the ${plan} plan.`);
        return;
      }

      const planLimits = {
        Free: 300,
        Bronze: 420,
        Silver: 600,
        Gold: Infinity
      };

      await updateDoc(userRef, {
        subscription: {
          plan: plan,
          watchLimit: planLimits[plan],
          subscribedAt: serverTimestamp()
        },
        WatchTimeUsedToday: 0,
        lastWatchedDate: serverTimestamp()
      });

      alert(`${plan} plan activated successfully!`);

      // Send email invoice if paid plan
      if (plan !== "Free") {
        await sendInvoice(user.email, user.displayName || "User", plan, planPrices[plan]);
        alert("Invoice sent to your email.");
      }

    } catch (err) {
      console.error("Error upgrading plan:", err);
      alert("Something went wrong while subscribing. Try again.");
    }
  };

  return (
    <div className="plans-wrapper">
      <h3 className="title">Offers from Mytube:</h3>

      <div className="plan-container">
        {/* Gold Plan */}
        <div className="plan-card gold">
          <img src={img3} alt="Gold" className="plan-img" />
          <h4>Gold</h4>
          <p>🥇 <strong>Gold Plan</strong>: Enjoy <strong>unlimited</strong> video watching time every day. Perfect for power users!</p>
          <button onClick={() => setnews1("Cost: ₹100")}>Show Cost</button>
          <button onClick={() => Plan("Gold")}>Access plan</button>
          <p className="price">{news1}</p>
        </div>

        {/* Silver Plan */}
        <div className="plan-card silver">
          <img src={img2} alt="Silver" className="plan-img" />
          <h4>Silver</h4>
          <p>🥈 <strong>Silver Plan</strong>: Watch up to <strong>10 minutes</strong> of videos daily. Ideal for regular viewers!</p>
          <button onClick={() => setnews2("Cost: ₹50")}>Show Cost</button>
          <button onClick={() => Plan("Silver")}>Access plan</button>
          <p className="price">{news2}</p>
        </div>

        {/* Bronze Plan */}
        <div className="plan-card bronze">
          <img src={img1} alt="Bronze" className="plan-img" />
          <h4>Bronze</h4>
          <p>🥉 <strong>Bronze Plan</strong>: Watch up to <strong>7 minutes</strong> of videos daily. Upgrade for more access!</p>
          <button onClick={() => setnews3("Cost: ₹10")}>Show Cost</button>
          <button onClick={() => Plan("Bronze")}>Access plan</button>
          <p className="price">{news3}</p>
        </div>
      </div>
    </div>
  );
};

export default Plans;

