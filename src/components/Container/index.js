import styled from 'styled-components'
import { Paper } from '@mui/material'
import { colors } from '../../config/theme'

export const Container = styled(Paper)`
	background: ${colors.whiteColor};
	box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.10), 0px 10px 30px 0px rgba(0, 0, 0, 0.05);
	border-radius: 10px;
    padding: 24px 0px 0px 0px;
`