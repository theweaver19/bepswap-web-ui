import { TransferEvent } from '@thorchain/asgardex-binance';
import { bn } from '@thorchain/asgardex-util';
import { tokenAmount, baseAmount } from '@thorchain/asgardex-token';
import {
  withdrawResult,
  getCreatePoolTokens,
  getPoolData,
  getCalcResult,
  CalcResult,
  getCreatePoolCalc,
  CreatePoolCalc,
} from './utils';
import { PoolData } from './types';
import { AssetData } from '../../redux/wallet/types';
import {
  PoolDetail,
  PoolDetailStatusEnum,
} from '../../types/generated/midgard';
import { PriceDataIndex, PoolDataMap } from '../../redux/midgard/types';

const poolData: PoolDataMap = {
  BNB: {
    asset: 'BNB.BNB',
    assetDepth: '2224480142',
    assetROI: '0.030997470337411938',
    assetStakedTotal: '2157600000',
    buyAssetCount: '292',
    buyFeeAverage: '7060697414.182593',
    buyFeesTotal: '2061723644941',
    buySlipAverage: '0.020423287763786567',
    buyTxAverage: '2847231178.710591',
    buyVolume: '831391504183',
    poolDepth: '752064535802',
    poolFeeAverage: '6440609693.924242',
    poolFeesTotal: '2125401198995',
    poolROI: '0.6120802254729578',
    poolROI12: '0.6093876217266438',
    poolSlipAverage: '0.031693333633081765',
    poolStakedTotal: '536183263953',
    poolTxAverage: '4979658580.63162',
    poolUnits: '201288130514',
    poolVolume: '1391790523992',
    poolVolume24hr: '0',
    price: '169.04276230711346',
    runeDepth: '376032267901',
    runeROI: '1.1931629806085038',
    runeStakedTotal: '171456600000',
    sellAssetCount: '38',
    sellFeeAverage: '1675725106.6842105',
    sellFeesTotal: '63677554054',
    sellSlipAverage: '0.11829473873398169',
    sellTxAverage: '21365679669.077423',
    sellVolume: '560399019809',
    stakeTxCount: '12',
    stakersCount: '4',
    stakingTxCount: '12',
    status: PoolDetailStatusEnum.Enabled,
    swappersCount: '4',
    swappingTxCount: '330',
    withdrawTxCount: '0',
  } as PoolDetail,
  'TCAN-014': {
    asset: 'BNB.TCAN-014',
    assetDepth: '6169348584',
    assetROI: '-0.010853723480032832',
    assetStakedTotal: '32295600000',
    buyAssetCount: '2',
    buyFeeAverage: '4929697738.866591',
    buyFeesTotal: '9859395477',
    buySlipAverage: '2.601949904114008',
    buyTxAverage: '1759229403.5795393',
    buyVolume: '3518458807',
    poolDepth: '50231823350',
    poolFeeAverage: '2124081453.2',
    poolFeesTotal: '10620407266',
    poolROI: '0.08815519421775683',
    poolROI12: '0.08815519421775683',
    poolSlipAverage: '1.2100599586963654',
    poolStakedTotal: '262006271466',
    poolTxAverage: '1273642962.3769557',
    poolUnits: '15255810504',
    poolVolume: '6875947614',
    poolVolume24hr: '0',
    price: '4.071080006751001',
    runeDepth: '25115911675',
    runeROI: '0.1871641119155465',
    runeStakedTotal: '130528300000',
    sellAssetCount: '3',
    sellFeeAverage: '253670596.33333334',
    sellFeesTotal: '761011789',
    sellSlipAverage: '0.282133328417937',
    sellTxAverage: '949918668.2419002',
    sellVolume: '3357488807',
    stakeTxCount: '9',
    stakersCount: '1',
    stakingTxCount: '12',
    status: PoolDetailStatusEnum.Enabled,
    swappersCount: '5',
    swappingTxCount: '5',
    withdrawTxCount: '3',
  } as PoolDetail,
};

// TODO: Fix unit test
describe.skip('pool/utils/', () => {
  describe('witdrawResult', () => {
    it('should validate a withdraw transfer', () => {
      const tx: TransferEvent = {
        stream: 'transfers',
        data: {
          e: 'outboundTransferInfo',
          E: 62498151,
          H: '1A4C9EB6438CC87B9DD67707770DE662F6212B68A93A5ABCE2DA0AC09B3FDCE1',
          M:
            'OUTBOUND:0C48D82F045B5AABD02663551D19CE18D2266E966ABD3A4D5ACBD3762C8EC692',
          f: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
          t: [
            {
              o: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
              c: [
                {
                  a: 'TUSDB-000',
                  A: '0.79146284',
                },
              ],
            },
          ],
        },
      };
      const result = withdrawResult({
        tx,
        symbol: 'TUSDB-000',
        address: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
      });
      expect(result).toBeTruthy();
    });
  });

  describe('getCreatePoolTokens', () => {
    it('should filter pool assets ', () => {
      const assetA: AssetData = {
        asset: 'A',
        assetValue: tokenAmount(1),
        price: bn(2),
      };
      const assetB: AssetData = {
        asset: 'B',
        assetValue: tokenAmount(1),
        price: bn(2),
      };
      const assets: AssetData[] = [assetA, assetB];
      const pools: string[] = ['A.A'];
      const result = getCreatePoolTokens(assets, pools);
      const expected = [assetB];
      expect(result).toEqual(expected);
    });
    it('should filter `RUNE` assets ', () => {
      const assetA: AssetData = {
        asset: 'RUNE',
        assetValue: tokenAmount(1),
        price: bn(2),
      };
      const assetB: AssetData = {
        asset: 'RUNE',
        assetValue: tokenAmount(1),
        price: bn(2),
      };
      const assetC: AssetData = {
        asset: 'C',
        assetValue: tokenAmount(1),
        price: bn(2),
      };
      const assets: AssetData[] = [assetA, assetB, assetC];
      const pools: string[] = ['A.A'];
      const result = getCreatePoolTokens(assets, pools);
      const expected = [assetC];
      expect(result).toEqual(expected);
    });
  });
  describe('getPoolData', () => {
    const bnbPoolDetail: PoolDetail = {
      asset: 'BNB.BNB',
      assetDepth: '611339',
      assetROI: '-0.4442372727272727',
      assetStakedTotal: '1100000',
      buyAssetCount: '1',
      buyFeeAverage: '199600',
      buyFeesTotal: '199600',
      buySlipAverage: '1002000',
      buyTxAverage: '32387',
      buyVolume: '32387',
      poolDepth: '399999598',
      poolFeeAverage: '99800',
      poolFeesTotal: '199600',
      poolROI: '999.2768763636363',
      poolROI12: '1000.2778813636363',
      poolSlipAverage: '501000',
      poolStakedTotal: '359965441',
      poolTxAverage: '16193',
      poolUnits: '47400323',
      poolVolume: '32387',
      poolVolume24hr: '0',
      price: '327.15040100500704',
      runeDepth: '199999799',
      runeROI: '1998.99799',
      runeStakedTotal: '100000',
      sellAssetCount: '0',
      sellFeeAverage: '0',
      sellFeesTotal: '0',
      sellSlipAverage: '0',
      sellTxAverage: '0',
      sellVolume: '0',
      stakeTxCount: '3',
      stakersCount: '1',
      stakingTxCount: '4',
      status: PoolDetailStatusEnum.Enabled,
      swappersCount: '1',
      swappingTxCount: '1',
      withdrawTxCount: '1',
    };

    const fsnPoolDetail: PoolDetail = {
      asset: 'BNB.FSN-F1B',
      assetDepth: '100000',
      assetROI: '0',
      assetStakedTotal: '100000',
      buyAssetCount: '0',
      buyFeeAverage: '0',
      buyFeesTotal: '0',
      buySlipAverage: '0',
      buyTxAverage: '0',
      buyVolume: '0',
      poolDepth: '400000',
      poolFeeAverage: '0',
      poolFeesTotal: '0',
      poolROI: '0.5',
      poolROI12: '0.5',
      poolSlipAverage: '0',
      poolStakedTotal: '300000',
      poolTxAverage: '0',
      poolUnits: '87500',
      poolVolume: '0',
      poolVolume24hr: '0',
      price: '2',
      runeDepth: '200000',
      runeROI: '1',
      runeStakedTotal: '100000',
      sellAssetCount: '0',
      sellFeeAverage: '0',
      sellFeesTotal: '0',
      sellSlipAverage: '0',
      sellTxAverage: '0',
      sellVolume: '0',
      stakeTxCount: '2',
      stakersCount: '1',
      stakingTxCount: '2',
      status: PoolDetailStatusEnum.Enabled,
      swappersCount: '0',
      swappingTxCount: '0',
      withdrawTxCount: '0',
    };
    const priceIndex: PriceDataIndex = {
      RUNE: bn(1),
      FSN: bn(2),
    };
    it('returns PoolData for a FSN based pool', () => {
      const expected: PoolData = {
        asset: 'RUNE',
        target: 'FSN',
        depth: baseAmount(200000),
        volume24: baseAmount(0),
        volumeAT: baseAmount(0),
        transaction: baseAmount(0),
        liqFee: baseAmount(0),
        roiAT: 50,
        poolROI12: bn(50),
        totalSwaps: 0,
        totalStakers: 1,
        values: {
          pool: {
            asset: 'RUNE',
            target: 'FSN',
          },
          target: 'FSN',
          symbol: 'FSN-F1B',
          depth: 'RUNE 0.00',
          volume24: 'RUNE 0.00',
          transaction: 'RUNE 0.00',
          liqFee: '0.00%',
          roiAT: '50% pa',
          poolPrice: 'RUNE 2.000',
        },
        raw: {
          depth: baseAmount(200000),
          volume24: baseAmount(0),
          transaction: baseAmount(0),
          liqFee: baseAmount(0),
          roiAT: 50,
          poolPrice: bn(1),
        },
      };
      const result = getPoolData('RUNE', fsnPoolDetail, priceIndex, 'RUNE');
      const rRaw = result.raw;
      const eRaw = expected.raw;

      expect(result.asset).toEqual(expected.asset);
      expect(result.target).toEqual(expected.target);
      expect(result.depth.amount()).toEqual(expected.depth.amount());
      expect(result.volume24.amount()).toEqual(expected.volume24.amount());
      expect(result.transaction.amount()).toEqual(
        expected.transaction.amount(),
      );
      expect(result.liqFee.amount()).toEqual(expected.liqFee.amount());
      expect(result.roiAT).toEqual(expected.roiAT);
      expect(result.totalSwaps).toEqual(expected.totalSwaps);
      expect(result.totalStakers).toEqual(expected.totalStakers);
      expect(result.values).toEqual(expected.values);

      expect(rRaw.depth.amount()).toEqual(eRaw.depth.amount());
      expect(rRaw.volume24.amount()).toEqual(eRaw.volume24.amount());
      expect(rRaw.transaction.amount()).toEqual(eRaw.transaction.amount());
      expect(rRaw.liqFee.amount()).toEqual(eRaw.liqFee.amount());
      expect(rRaw.roiAT).toEqual(eRaw.roiAT);
      // Unsafe, just to test all props again (in case we might forget to test a new property in the future)
      expect(result.toString()).toEqual(expected.toString());
    });
    it('returns PoolData for a BNB based pool', () => {
      const expected: PoolData = {
        asset: 'RUNE',
        target: 'BNB',
        depth: baseAmount(199999799),
        volume24: baseAmount(0),
        volumeAT: baseAmount(32387),
        transaction: baseAmount(16193),
        liqFee: baseAmount(99800),
        roiAT: 99927.69,
        poolROI12: bn(50),
        totalSwaps: 1,
        totalStakers: 1,
        values: {
          pool: {
            asset: 'RUNE',
            target: 'BNB',
          },
          target: 'BNB',
          symbol: 'BNB',
          depth: 'RUNE 2.00',
          volume24: 'RUNE 0.00',
          transaction: 'RUNE 0.00',
          liqFee: '0.00%',
          roiAT: '99927.69% pa',
          poolPrice: 'RUNE 0.000',
        },
        raw: {
          depth: baseAmount(199999799),
          volume24: baseAmount(0),
          transaction: baseAmount(16193),
          liqFee: baseAmount(99800),
          roiAT: 99927.69,
          poolPrice: bn(0.09),
        },
      };
      const result = getPoolData('RUNE', bnbPoolDetail, priceIndex, 'RUNE');
      const rRaw = result.raw;
      const eRaw = expected.raw;

      expect(result.asset).toEqual(expected.asset);
      expect(result.target).toEqual(expected.target);
      expect(result.depth.amount()).toEqual(expected.depth.amount());
      expect(result.volume24.amount()).toEqual(expected.volume24.amount());
      expect(result.transaction.amount()).toEqual(
        expected.transaction.amount(),
      );
      expect(result.liqFee.amount()).toEqual(expected.liqFee.amount());
      expect(result.roiAT).toEqual(expected.roiAT);
      expect(result.totalSwaps).toEqual(expected.totalSwaps);
      expect(result.totalStakers).toEqual(expected.totalStakers);
      expect(result.values).toEqual(expected.values);

      expect(rRaw.depth.amount()).toEqual(eRaw.depth.amount());
      expect(rRaw.volume24.amount()).toEqual(eRaw.volume24.amount());
      expect(rRaw.transaction.amount()).toEqual(eRaw.transaction.amount());
      expect(rRaw.liqFee.amount()).toEqual(eRaw.liqFee.amount());
      expect(rRaw.roiAT).toEqual(eRaw.roiAT);
      // Unsafe, just to test all props again (in case we might forget to test a new property in the future)
      expect(result.toString()).toEqual(expected.toString());
    });
  });

  describe('getCalcResult', () => {
    it('calculates result of staking into RUNE - BNB pool ', () => {
      const poolAddress = 'tbnabc123';
      const runeAmount = tokenAmount(744.568);
      const runePrice = bn(1);
      const tAmount = tokenAmount(0.023);
      const expected: CalcResult = {
        poolAddress: 'tbnabc123',
        ratio: bn(0.01),
        symbolTo: 'BNB',
        poolUnits: bn('201288130514'),
        poolPrice: bn(169.04),
        newPrice: bn(202.31),
        newDepth: bn('413455067077.65'),
        share: bn(8.32),
        Pr: bn(1),
        R: bn('376032267901'),
        T: bn(2224480142),
      };

      const result: CalcResult = getCalcResult(
        'BNB',
        poolData,
        poolAddress,
        runeAmount,
        runePrice,
        tAmount,
      );

      expect(result.poolAddress).toEqual(expected.poolAddress);
      expect(result.ratio).toEqual(expected.ratio);
      expect(result.symbolTo).toEqual(expected.symbolTo);
      expect(result.poolUnits).toEqual(expected.poolUnits);
      expect(result.poolPrice).toEqual(expected.poolPrice);
      expect(result.newPrice).toEqual(expected.newPrice);
      expect(result.newDepth).toEqual(expected.newDepth);
      expect(result.share).toEqual(expected.share);
      expect(result.Pr).toEqual(expected.Pr);
      expect(result.R).toEqual(expected.R);
      expect(result.T).toEqual(expected.T);
      // Test all again just in case we will forget to test a new property in the future
      expect(result).toEqual(expected);
    });

    it('calculates result of staking into RUNE - TCAN pool ', () => {
      const poolAddress = 'tbnabc123';
      const runeAmount = tokenAmount(938.803);
      const runePrice = bn(1);
      const tAmount = tokenAmount(49.061);
      const expected = {
        poolAddress: 'tbnabc123',
        ratio: bn('0.25'),
        symbolTo: 'TCAN-014',
        poolUnits: bn('15255810504'),
        poolPrice: bn(4.07),
        newPrice: bn(10.74),
        newDepth: bn('82042624485.56'),
        share: bn(61.6),
        Pr: bn(1),
        R: bn('25115911675'),
        T: bn('6169348584'),
      };

      const result: CalcResult = getCalcResult(
        'TCAN-014',
        poolData,
        poolAddress,
        runeAmount,
        runePrice,
        tAmount,
      );

      expect(result.poolAddress).toEqual(expected.poolAddress);
      expect(result.ratio).toEqual(expected.ratio);
      expect(result.symbolTo).toEqual(expected.symbolTo);
      expect(result.poolUnits).toEqual(expected.poolUnits);
      expect(result.poolPrice).toEqual(expected.poolPrice);
      expect(result.newPrice).toEqual(expected.newPrice);
      expect(result.newDepth).toEqual(expected.newDepth);
      expect(result.share).toEqual(expected.share);
      expect(result.Pr).toEqual(expected.Pr);
      expect(result.R).toEqual(expected.R);
      expect(result.T).toEqual(expected.T);
      // Test all again just in case we will forget to test a new property in the future
      expect(result).toEqual(expected);
    });
  });

  describe('getCreatePoolCalc', () => {
    it('calculates data to create a TOMOB-1E1 pool', () => {
      const tokenSymbol = 'TOMOB-1E1';
      const poolAddress = 'tbnb1XXX';
      const runeAmount = tokenAmount(809.29);
      const runePrice = bn(1);
      const tAmount = tokenAmount(0.14);
      const expected: CreatePoolCalc = {
        poolAddress: 'tbnb1XXX',
        tokenSymbol: 'TOMOB-1E1',
        poolPrice: bn('5780.64285714285714285714'),
        depth: bn(809.29),
        share: 100,
        Pr: bn(1),
      };
      const result = getCreatePoolCalc({
        tokenSymbol,
        poolAddress,
        runeAmount,
        runePrice,
        tokenAmount: tAmount,
      });
      expect(result.poolAddress).toEqual(expected.poolAddress);
      expect(result.tokenSymbol).toEqual(expected.tokenSymbol);
      expect(result.poolPrice).toEqual(expected.poolPrice);
      expect(result.depth).toEqual(expected.depth);
      expect(result.share).toEqual(expected.share);
      expect(result.Pr).toEqual(expected.Pr);
      // Test all again, just in case of other properties in the future
      expect(result).toEqual(expected);
    });

    it('calculates data to create a TOMOB-1E1 pool again, but with more amounts', () => {
      const tokenSymbol = 'TOMOB-1E1';
      const poolAddress = 'tbnb1XXX';
      const runeAmount = tokenAmount(3237.152);
      const runePrice = bn(1);
      const tAmount = tokenAmount(0.559);
      const expected: CreatePoolCalc = {
        poolAddress: 'tbnb1XXX',
        tokenSymbol: 'TOMOB-1E1',
        poolPrice: bn('5790.96958855098389982111'),
        depth: bn(3237.152),
        share: 100,
        Pr: bn(1),
      };
      const result = getCreatePoolCalc({
        tokenSymbol,
        poolAddress,
        runeAmount,
        runePrice,
        tokenAmount: tAmount,
      });
      expect(result.poolAddress).toEqual(expected.poolAddress);
      expect(result.tokenSymbol).toEqual(expected.tokenSymbol);
      expect(result.poolPrice).toEqual(expected.poolPrice);
      expect(result.depth).toEqual(expected.depth);
      expect(result.share).toEqual(expected.share);
      expect(result.Pr).toEqual(expected.Pr);
      // Test all again, just in case of other properties in the future
      expect(result).toEqual(expected);
    });
  });
});
