import styled from 'styled-components';
import { colors } from '../../config/theme';

export const ErrorBox = styled.div`
	padding: 8px 0 0 0;
	font-weight: 400;
	font-size: 12px;
	color: ${colors.errorColor};
	display: flex;
	align-items: center;
	gap: 4px
`;
