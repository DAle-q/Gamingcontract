
import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";
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
    const getTarget = async () => {
      const query = gameClient.createQuery({
        method: { name: "getTarget", args: [] }
      });
      const receipt = await gameClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }

 
    const announceWinner = async () => {
      const query = gameClient.createQuery({
        method: { name: "announcewinner", args: [] }
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

    it("setFlag", async () => {
      await execMethod("setFlag");
     // assert.isTrue("true");
    })
/* 
    it("setBetPlayer1", async () => {
      await execMethod("setBetplayer1");
      assert.equal(await announceWinner(), 10);
      
    }) */
    it("setBetPlayer1", async () => {
    const query = gameClient.createQuery({ method: { name: "setBetplayer1", args: [] } });
    const receipt = await gameClient.submitQuery(query);
    const result = Result.unwrapString(receipt);
    assert.equal(result, "You won");
    })

    it("setBetPlayer2", async () => {
      const query = gameClient.createQuery({ method: { name: "setBetplayer2", args: [] } });
      const receipt = await gameClient.submitQuery(query);
      const result = Result.unwrapString(receipt);
      assert.equal(result, "You did not win");
    })
   
  });
  after(async () => {
    await provider.close();
  });
});
