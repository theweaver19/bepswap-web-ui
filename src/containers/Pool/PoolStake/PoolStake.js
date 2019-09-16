import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Icon } from 'antd';
import ChainService from '../../../clients/chainservice';

import Button from '../../../components/uielements/button';
import Label from '../../../components/uielements/label';
import Status from '../../../components/uielements/status';
import Coin from '../../../components/uielements/coins/coin';
import CoinCard from '../../../components/uielements/coins/coinCard';
import CoinData from '../../../components/uielements/coins/coinData';
import Slider from '../../../components/uielements/slider';
import TxTimer from '../../../components/uielements/txTimer';
import Drag from '../../../components/uielements/drag';

import { greyArrowIcon } from '../../../components/icons';

import appActions from '../../../redux/app/actions';

import {
  ContentWrapper,
  ConfirmModal,
  ConfirmModalContent,
} from './PoolStake.style';

import { getPair } from '../../../helpers/stringHelper';
import { stakeInfo, stakeNewInfo, shareInfo } from './data';

const {
  setTxTimerType,
  setTxTimerModal,
  setTxTimerStatus,
  setTxTimerValue,
  resetTxStatus,
} = appActions;

class PoolStake extends Component {
  static propTypes = {
    info: PropTypes.string,
    view: PropTypes.string.isRequired,
    txStatus: PropTypes.object.isRequired,
    setTxTimerType: PropTypes.func.isRequired,
    setTxTimerModal: PropTypes.func.isRequired,
    setTxTimerStatus: PropTypes.func.isRequired,
    setTxTimerValue: PropTypes.func.isRequired,
    resetTxStatus: PropTypes.func.isRequired,
  };

  static defaultProps = {
    info: '',
  };

  state = {
    dragReset: true,
  };

  constructor(props) {
    super(props);

    this.getPoolData();
  }

  getPoolData = () => {
    const ticker = this.props.info.split('-').find(tick => tick !== 'rune');
    ChainService.getPool(ticker.toUpperCase())
      .then(response => {
        // TODO: use this data to display pool information instead of data pulled from data.js
        this.setState({ data: response.data });
      })
      .catch(error => {
        console.error(error);
      });
  };

  handleGotoDetail = () => {
    const { info } = this.props;
    const URL = `/pool/stake-detail/${info}`;

    this.props.history.push(URL);
  };

  handleDrag = () => {
    this.setState({
      dragReset: false,
    });
  };

  handleStake = () => {
    const { setTxTimerModal, setTxTimerType, setTxTimerStatus } = this.props;

    setTxTimerType('stake');
    setTxTimerModal(true);
    setTxTimerStatus(true);
  };

  handleCloseModal = () => {
    const {
      txStatus: { status },
      setTxTimerModal,
      resetTxStatus,
    } = this.props;

    if (!status) resetTxStatus();
    else setTxTimerModal(false);
  };

  handleConfirmStake = () => {
    this.handleGotoStakeView();
  };

  handleGotoStakeView = () => {
    const { info } = this.props;
    const URL = `/pool/stake-view/${info}`;

    this.props.history.push(URL);
  };

  handleAddMore = () => {
    const { info } = this.props;
    const URL = `/pool/stake-new/${info}`;

    this.props.history.push(URL);
  };

  handleGotoWithdraw = () => {
    const { info } = this.props;
    const URL = `/pool/withdraw/${info}`;

    this.props.history.push(URL);
  };

  handleWithdraw = () => {
    const { setTxTimerModal, setTxTimerType, setTxTimerStatus } = this.props;

    setTxTimerType('withdraw');
    setTxTimerModal(true);
    setTxTimerStatus(true);
  };

  handleChangeTxValue = value => {
    const { setTxTimerValue } = this.props;

    setTxTimerValue(value);
  };

  handleEndTxTimer = () => {
    const {
      txStatus: { type },
      setTxTimerStatus,
      resetTxStatus,
    } = this.props;

    this.setState({
      dragReset: true,
    });
    setTxTimerStatus(false);

    // staked?
    if (type === 'stake') {
      resetTxStatus();
      this.handleConfirmStake();
    }
  };

  renderStakeModalContent = swapData => {
    const {
      txStatus: { status, value },
    } = this.props;
    const { source, target } = swapData;

    const transactionLabels = [
      'sending transaction',
      'processing transaction',
      'signing transaction',
      'finishing transaction',
      'complete',
    ];

    const completed = value !== null && !status;
    const stakeText = !completed ? 'YOU ARE STAKING' : 'YOU STAKED';

    return (
      <ConfirmModalContent>
        <div className="left-container">
          <Label weight="bold">{stakeText}</Label>
          <CoinData asset={source} assetValue={2.49274} price={217.92} />
          <CoinData asset={target} assetValue={2.49274} price={217.92} />
        </div>
        <div className="center-container">
          <TxTimer
            reset={status}
            value={value}
            onChange={this.handleChangeTxValue}
            onEnd={this.handleEndTxTimer}
          />
          {value !== 0 && (
            <Label weight="bold">{transactionLabels[value - 1]}</Label>
          )}
          {completed && <Label weight="bold">complete</Label>}
        </div>
        <div className="right-container" />
      </ConfirmModalContent>
    );
  };

  renderWithdrawModalContent = swapData => {
    const {
      txStatus: { status, value },
    } = this.props;
    const { source, target } = swapData;

    const transactionLabels = [
      'sending transaction',
      'processing transaction',
      'signing transaction',
      'finishing transaction',
      'complete',
    ];

    const completed = value !== null && !status;
    const withdrawText = !completed ? 'YOU ARE WITHDRAWING' : 'YOU WITHDRAWN';

    return (
      <ConfirmModalContent>
        <div className="left-container" />
        <div className="center-container">
          <TxTimer
            reset={status}
            value={value}
            onChange={this.handleChangeTxValue}
            onEnd={this.handleEndTxTimer}
          />
          {value !== 0 && (
            <Label weight="bold">{transactionLabels[value - 1]}</Label>
          )}
          {completed && <Label weight="bold">complete</Label>}
        </div>
        <div className="right-container">
          <Label weight="bold">{withdrawText}</Label>
          <CoinData asset={source} assetValue={2.49274} price={217.92} />
          <CoinData asset={target} assetValue={2.49274} price={217.92} />
        </div>
      </ConfirmModalContent>
    );
  };

  renderStakeInfo = pair => {
    const { view } = this.props;
    const { source, target } = pair;

    const stakePool = `${source}:${target}`;

    return (
      <Row className="stake-status-view">
        <Col className="stake-pool-col" span={8}>
          <Coin type={source} over={target} />
          <Status
            className="stake-pool-status"
            title="Pool"
            value={stakePool}
          />
        </Col>
        <Col className="stake-info-col" span={16}>
          {view === 'stake-new' &&
            stakeNewInfo.map(info => {
              return <Status className="stake-info-status" {...info} />;
            })}
          {(view === 'stake-detail' ||
            view === 'stake-view' ||
            view === 'withdraw') &&
            stakeInfo.map(info => {
              return <Status className="stake-info-status" {...info} />;
            })}
        </Col>
      </Row>
    );
  };

  renderShareDetail = pair => {
    const { view } = this.props;
    const { dragReset } = this.state;
    const { source, target } = pair;

    if (view === 'stake-new') {
      return '';
    }

    return (
      <>
        {view !== 'withdraw' && (
          <Label className="label-title" size="normal" weight="bold">
            ADD SHARE
          </Label>
        )}
        {view === 'withdraw' && (
          <Label
            className="label-title go-back"
            onClick={this.handleGotoStakeView}
            color="primary"
            size="normal"
            weight="bold"
          >
            <Icon type="left" />
            <span>Back</span>
          </Label>
        )}
        {view === 'stake-detail' && (
          <>
            <Label className="label-description" size="normal">
              Select the maximum deposit to stake.
            </Label>
            <Label className="label-no-padding" size="normal">
              Note: Pools always have RUNE as the base asset.
            </Label>
            <div className="stake-card-wrapper">
              <CoinCard
                asset={source}
                amount={0.75}
                price={217.29}
                withSelection
              />
              <CoinCard
                asset={target}
                amount={0.0}
                price={217.29}
                withSelection
              />
            </div>
            <Label className="label-title" size="normal" weight="bold">
              ADJUST BALANCE
            </Label>
            <Label size="normal">
              Fine tune balances to ensure you stake on both sides with the
              correct amount.
            </Label>
            <Slider defaultValue={500} max={1000} />
            <div className="stake-share-info-wrapper">
              <div className="pool-status-wrapper">
                {shareInfo.pool.map(info => {
                  return <Status className="share-info-status" {...info} />;
                })}
              </div>
              <div className="share-status-wrapper">
                <div className="info-status-wrapper">
                  {shareInfo.share.map(info => {
                    return <Status className="share-info-status" {...info} />;
                  })}
                </div>
                <Drag
                  title="Drag to stake"
                  source="blue"
                  target="confirm"
                  reset={dragReset}
                  onConfirm={this.handleStake}
                  onDrag={this.handleDrag}
                />
              </div>
            </div>
          </>
        )}
        {view === 'stake-view' && (
          <>
            <Label size="normal">Add more from your wallet.</Label>
            <Button
              onClick={this.handleAddMore}
              color="primary"
              typevalue="outline"
            >
              Add more
            </Button>
          </>
        )}
        {view === 'withdraw' && (
          <>
            <Label className="label-title" size="normal" weight="bold">
              ADJUST WITHDRAWAL
            </Label>
            <Label size="normal">
              Choose from 0 to 100% of how much to withdraw.
            </Label>
            <div className="withdraw-percent-view">
              <Label size="large" color="gray" weight="bold">
                0%
              </Label>
              <Label size="large" color="gray" weight="bold">
                50%
              </Label>
              <Label size="large" color="gray" weight="bold">
                100%
              </Label>
            </div>
            <Slider defaultValue={50} max={100} />
            <div className="stake-withdraw-info-wrapper">
              <Label className="label-title" size="normal" weight="bold">
                YOU SHOULD RECEIVE
              </Label>
              <div className="withdraw-status-wrapper">
                <div className="withdraw-asset-wrapper">
                  <CoinData
                    asset={source}
                    assetValue="2.492740"
                    price={217.92}
                  />
                  <CoinData
                    asset={target}
                    assetValue="2.492740"
                    price={217.92}
                  />
                </div>
                <Drag
                  title="Drag to withdraw"
                  source="blue"
                  target="confirm"
                  reset={dragReset}
                  onConfirm={this.handleWithdraw}
                  onDrag={this.handleDrag}
                />
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  renderYourShare = pair => {
    const { view } = this.props;
    const { source, target } = pair;

    return (
      <div className="your-share-wrapper">
        <Label className="label-title" size="normal" weight="bold">
          YOUR SHARE
        </Label>
        {view === 'stake-new' && (
          <>
            <Label size="normal">You don't have any shares in this pool.</Label>
            <Button onClick={this.handleGotoDetail} color="success">
              add share
            </Button>
          </>
        )}
        {view === 'stake-detail' && (
          <>
            <Label size="normal">Complete the process to add a share.</Label>
            <div className="right-arrow-wrapper">
              <img src={greyArrowIcon} alt="grey-arrow" />
            </div>
          </>
        )}
        {(view === 'stake-view' || view === 'withdraw') && (
          <>
            <Label size="normal">Your total share of the pool.</Label>
            <div className="your-share-info-wrapper">
              <div className="your-share-info">
                <Status title={String(source).toUpperCase()} value={0.65} />
                <Label
                  className="your-share-price-label"
                  size="normal"
                  color="grey"
                >
                  $USD 120.10
                </Label>
              </div>
              <div className="your-share-info">
                <Status title={String(target).toUpperCase()} value={1234} />
                <Label
                  className="your-share-price-label"
                  size="normal"
                  color="grey"
                >
                  $USD 120.10
                </Label>
              </div>
              <div className="your-share-info">
                <Status title="Pool Share" value="3%" />
              </div>
            </div>
            <Label className="label-title" size="normal" weight="bold">
              EARNINGS
            </Label>
            <Label size="normal">Total of all earnings from this pool.</Label>
            <div className="your-share-info-wrapper">
              <div className="your-share-info">
                <Status title={String(source).toUpperCase()} value={0.06} />
                <Label
                  className="your-share-price-label"
                  size="normal"
                  color="grey"
                >
                  $USD 12.10
                </Label>
              </div>
              <div className="your-share-info">
                <Status title={String(target).toUpperCase()} value={123} />
                <Label
                  className="your-share-price-label"
                  size="normal"
                  color="grey"
                >
                  $USD 12.10
                </Label>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  render() {
    const { view, info, txStatus } = this.props;
    const pair = getPair(info);

    if (!pair) {
      return '';
    }

    const openStakeModal = txStatus.type === 'stake' ? txStatus.modal : false;
    const openWithdrawModal =
      txStatus.type === 'withdraw' ? txStatus.modal : false;
    const coinCloseIconType = txStatus.status ? 'fullscreen-exit' : 'close';

    return (
      <ContentWrapper className="pool-stake-wrapper">
        {this.renderStakeInfo(pair)}
        <Row className="share-view">
          <Col className="your-share-view" span={8}>
            {this.renderYourShare(pair)}
            {view === 'stake-view' && (
              <div className="withdraw-view-wrapper">
                <Label className="label-title" size="normal" weight="bold">
                  WITHDRAW
                </Label>
                <Label size="normal">
                  Withdraw everything including earnings.
                </Label>
                <Button
                  onClick={this.handleGotoWithdraw}
                  color="warning"
                  typevalue="outline"
                >
                  withdraw
                </Button>
              </div>
            )}
          </Col>
          <Col className="share-detail-view" span={16}>
            {this.renderShareDetail(pair)}
          </Col>
        </Row>
        <ConfirmModal
          title="WITHDRAW CONFIRMATION"
          closeIcon={
            <Icon type={coinCloseIconType} style={{ color: '#33CCFF' }} />
          }
          visible={openWithdrawModal}
          footer={null}
          onCancel={this.handleCloseModal}
        >
          {this.renderWithdrawModalContent(pair)}
        </ConfirmModal>
        <ConfirmModal
          title="STAKE CONFIRMATION"
          closeIcon={
            <Icon type={coinCloseIconType} style={{ color: '#33CCFF' }} />
          }
          visible={openStakeModal}
          footer={null}
          onCancel={this.handleCloseModal}
        >
          {this.renderStakeModalContent(pair)}
        </ConfirmModal>
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      txStatus: state.App.txStatus,
    }),
    {
      setTxTimerType,
      setTxTimerModal,
      setTxTimerStatus,
      setTxTimerValue,
      resetTxStatus,
    },
  ),
  withRouter,
)(PoolStake);