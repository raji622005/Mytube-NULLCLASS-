const Plan = async (plan) => {
  const uid = auth.currentUser?.uid;

  const planLimits = {
    Free: 300,    // 5 mins
    Bronze: 420,  // 7 mins
    Silver: 600,  // 10 mins
    Gold: Infinity
  };

  try {
    await updateDoc(doc(db, "users", uid), {
      subscription: {
        plan: plan,
        watchLimit: planLimits[plan],
        subscribedAt: serverTimestamp()
      }
    });

    alert(`${plan} plan activated successfully!`);
  } catch (err) {
    console.error("Error upgrading plan:", err);
  }
};
