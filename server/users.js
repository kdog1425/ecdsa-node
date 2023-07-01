const userToPublicKey = {
  betty: "0x0398ec8250866c269cd6eb3598d5da65cc93436b1f87a4eda00fc31bada1161ab9",
  joe: "0x02ceb61782e43540dc401b58305b532079d56283b4ea5f23cf3e297d71e205045d",
  harry: "0x02d915a742b993dc2604e0367241366d213eb9cf00ff2f5af97e8055fa652d7cca",
};

export const balances = {
  betty: 75,
  joe: 100,
  harry: 50,
};

export const findUserByPublicKey = (key) => {
  return (
    Object.keys(userToPublicKey).find(
      (user) => userToPublicKey[user] === key
    ) || null
  );
};
