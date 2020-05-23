import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert, expect } from "chai";
import * as fs from "fs";
import {
  makeSmartContractDeploy,
  makeContractCall,
  StacksTestnet,
  broadcastTransaction,
  makeContractSTXPostCondition,
  FungibleConditionCode,
} from "@blockstack/stacks-transactions";

const BigNum = require("bn.js");

describe("dice game contract test suite", () => {
  let gameClient: Client;
  let provider: Provider;
  before(async () => {
    provider = await ProviderRegistry.createProvider();
    gameClient = new Client("ST260DYV52QGC4P8MGB8PPM40VBXJ6PS8AE2AS9G0.dicegame", "dicegame", provider);
  });
  it("should have a valid syntax", async () => {
    await gameClient.checkContract();
   });

  describe("deploying an instance of the contract", () => {
    const price =0;
    const getTarget = async () => {
      const query = gameClient.createQuery({
        method: { name: "getTarget", args: [] }
      });
      const receipt = await gameClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }

    const getamount = async () => {
      const query = gameClient.createQuery({
        method: { name: "getamount", args: [] }
      });
      const receipt = await gameClient.submitQuery(query);
      const result = Result.unwrapUInt(receipt);
      return result;
    }

    const getFlag = async () => {
      const query = gameClient.createQuery({
        method: { name: "getFlag", args: [] }
      });
      const receipt = await gameClient.submitQuery(query);
      const result = Result.unwrap(receipt);
      return result;
    }

    const getBetPlayer1 = async () => {
      const query = gameClient.createQuery({
        method: { name: "getBetPlayer1", args: [] }
      });
      const receipt = await gameClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }

    const getBetPlayer2 = async () => {
      const query = gameClient.createQuery({
        method: { name: "getBetPlayer2", args: [] }
      });
      const receipt = await gameClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }

    const  getwinner= async () => {
      const query = gameClient.createQuery({
        method: { name: "getwinner", args: [] }
      });
      const receipt = await gameClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }
    

     const execMethod = async (method: string) => {
      const tx = gameClient.createTransaction({
        method: {
          name: method,
          args: [],
        },
      });
      await tx.sign("ST260DYV52QGC4P8MGB8PPM40VBXJ6PS8AE2AS9G0");
      const receipt = await gameClient.submitTransaction(tx);
      return receipt;
    }

    before(async () => {
      await gameClient.deployContract();
    });
    it("should start with no TARGET", async () => {
      const target = await getTarget();
      assert.equal(target, 0);
    })

    it("setTarget", async () => {
      await execMethod("setTarget");
      assert.equal(await getTarget(), 10);
    })

    it("setamount", async () => {
      await execMethod("setamount");
      assert.equal(await getamount(), 10);
    })

    it("should get TARGET", async () => {
      const amount = await getamount();
      assert.equal(amount, 10);
    })

    it("getFlag", async () => {
      const test = await getFlag();
      //expect(
    });

    it("setFlag", async () => {
      await execMethod("setFlag");
     // assert.equal(await getFlag(), true);
        })

    it("setBetPlayer1", async () => {
      await execMethod("setBetplayer1");
      assert.equal(await getBetPlayer1(), 10);
     
    }) 

   
    it("setBetPlayer2", async () => {
      await execMethod("setBetplayer2");
      assert.equal(await getBetPlayer2(), 20);
     
    }) 

    it("selectwinner", async () => {
      await execMethod("selectwinner");
      assert.equal(await getwinner(), 10);
         
    }) 
   
    it("isWinnerselected", async () => {
    const query = gameClient.createQuery({ method: { name: "isWinnerselected", args: [] } });
    const receipt = await gameClient.submitQuery(query);
    const result = Result.unwrapString(receipt);
    assert.equal(result, "Winner is selected");
       })
      });


      describe("dice game contract test suite test payout method in mocknet", () => {
       it("should pay winner", async () => {
        const keyscontract = JSON.parse(fs.readFileSync("./keys.json").toString());
        const keyswinner = JSON.parse(fs.readFileSync("./keys2.json").toString());
    
        const contractAddress = keyscontract.stacksAddress;
        const contractName = "dicegame";
        const codeBody = fs
          .readFileSync("./contracts/dicegame.clar")
          .toString();
    
        const price = 10;
    
        var fee = new BigNum(5289);
        const secretKeySender = keyscontract.secretKey;
        const secretKeyWinner = keyswinner.secretKey;
        const network = new StacksTestnet();
        const STACKS_API_URL = "http://127.0.0.1:20443";
        network.coreApiUrl = STACKS_API_URL;
        console.log("deploy contract");
        var transaction = await makeSmartContractDeploy({
          contractName,
          codeBody,
          fee,
          senderKey: secretKeySender,
          nonce: new BigNum(0),
          network,
        });
        console.log(await broadcastTransaction(transaction, network));
        await new Promise((r) => setTimeout(r, 30000));
        console.log("amount");
        fee = new BigNum(256);

        console.log("send prize to winner");
    transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "announcewinner",
      functionArgs: [],
      fee,
      senderKey: secretKeySender,
      nonce: new BigNum(1),
      network,
      postConditions: [
        makeContractSTXPostCondition(
          contractAddress,
          "dicegame",
          FungibleConditionCode.Equal,
          new BigNum(price)
        ),
      ],
    });

    console.log(await broadcastTransaction(transaction, network));
    await new Promise((r) => setTimeout(r, 10000));
       })
   
  });


    
    after(async () => {
      await provider.close();
    });
  
})
