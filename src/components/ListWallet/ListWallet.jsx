import React from "react";

const walletArr = [
  "0x54bbDa2E4C88D88E61b4Bc4F0CDc94dCeBD4e380",
  "0x54bbDa2E4C88D88E61b4Bc4F0CDc94dCeBD4e380",
  "0x54bbDa2E4C88D88E61b4Bc4F0CDc94dCeBD4e380",
];
const ListWallet = () => {
  return (
    <div className = "listWallet">
        {walletArr.map((element)=>(
            <h5>{element}</h5>
        ))}
      <tr>
        
      </tr>
     
    </div>
  );
};

export default ListWallet;
