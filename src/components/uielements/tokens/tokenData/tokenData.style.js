import styled from 'styled-components';
import { palette } from 'styled-theme';

export const TokenDataWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 8px;
  letter-spacing: 1px;

  .label-wrapper {
    padding: 0;
    text-transform: uppercase;
  }

  .coinData-coin-avatar {
    margin-right: ${props => (props.target ? '0px' : '12px')};
  }

  .coinData-asset-label {
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    color: ${palette('text', 0)};
  }

  .asset-price-info {
    display: flex;
    justify-content: flex-end;
    flex-grow: 1;

    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    color: ${palette('text', 3)};
  }
`;
