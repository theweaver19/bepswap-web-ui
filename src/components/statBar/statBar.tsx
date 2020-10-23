import React, { useCallback } from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';
import { bnOrZero } from '@thorchain/asgardex-util';
import { baseAmount, formatBaseAsTokenAmount } from '@thorchain/asgardex-token';

import LabelLoader from '../utility/loaders/label';
import { StatsData, NetworkInfo } from '../../types/generated/midgard/api';
import { StyledStatistic } from './statBar.style';

type Props = {
  stats: StatsData;
  networkInfo: NetworkInfo;
  loading?: boolean;
  basePrice?: string;
};

// TODO: refactor stats elements
const Statistics: React.FC<Props> = (props: Props): JSX.Element => {
  const { stats, networkInfo, basePrice = 'RUNE', loading } = props;

  const getUSDValue = useCallback(
    (val: string) => {
      const price = basePrice === 'RUNE' ? 1 : Number(basePrice);
      const bnValue = bnOrZero(val).dividedBy(price);
      const amount = baseAmount(bnValue);
      return formatBaseAsTokenAmount(amount, 0);
    },
    [basePrice],
  );

  const getPrefix = useCallback(() => {
    if (loading) return '';
    if (basePrice === 'RUNE') return 'ᚱ';
    return '$';
  }, [loading, basePrice]);

  const bondingAPYLabel = bnOrZero(networkInfo?.bondingAPY)
    .multipliedBy(100)
    .toFixed(2);
  const liquidityAPYLabel = bnOrZero(networkInfo?.liquidityAPY)
    .multipliedBy(100)
    .toFixed(2);

  return (
    <Row gutter={[16, 16]}>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic
          title="Total Pooled"
          formatter={() => {
            if (loading) return <LabelLoader />;
            return <span>{getUSDValue(stats?.totalStaked ?? '0')}</span>;
          }}
          prefix={getPrefix()}
        />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic
          title="Total Volume"
          formatter={() => {
            if (loading) return <LabelLoader />;
            return <span>{getUSDValue(stats?.totalVolume ?? '0')}</span>;
          }}
          prefix={getPrefix()}
        />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic
          title="Total Users"
          formatter={() => {
            if (loading) return <LabelLoader />;
            return <span>{stats?.totalUsers ?? '0'}</span>;
          }}
        />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic
          title="BONDING APY"
          formatter={() => {
            if (loading) return <LabelLoader />;
            return <span>{bondingAPYLabel}%</span>;
          }}
        />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic
          title="LIQUIDITY APY"
          formatter={() => {
            if (loading) return <LabelLoader />;
            return <span>{liquidityAPYLabel}%</span>;
          }}
        />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic
          title="Total Earned"
          formatter={() => {
            if (loading) return <LabelLoader />;
            return <span>{getUSDValue(stats?.totalEarned ?? '0')}</span>;
          }}
          prefix={getPrefix()}
        />
      </Col>
    </Row>
  );
};

export default Statistics;
