import React from 'react';
import { styled } from '@mui/material/styles';

const Table = styled('div')(({ theme }) => ({
  display: 'table',
  width: '100%',
  borderCollapse: 'collapse',
//   backgroundColor: '#2A2E37',
//   color: '#B4C8E1',
  border: '1px solid #404854'
}));

const Row = styled('div')({
  display: 'table-row'
});

const Cell = styled('div')(({ header, keyword }) => ({
  display: 'table-cell',
  padding: '12px 16px',
  borderBottom: '1px solid #404854',
  borderRight: '1px solid #404854',
  verticalAlign: 'top',
  ...(header && {
    // backgroundColor: '#1E2228',
    fontWeight: 500,
    textAlign: 'left'
  }),
  ...(keyword && {
    width: '100px',
    // backgroundColor: '#1E2228',
    fontWeight: 500
  })
}));

const ConfigTable = ({ keyword, leftColumn, rightColumn, sx }) => {
  return (
    <Table sx={sx}>
      {/* 标题行 */}
      <Row>
        <Cell header></Cell> {/* 空的关键字列标题 */}
        <Cell header>{leftColumn.title}</Cell>
        <Cell header>{rightColumn.title}</Cell>
      </Row>
      {/* 内容行 */}
      <Row>
        <Cell keyword>{keyword}</Cell> {/* 关键字列 */}
        <Cell>{leftColumn.content}</Cell>
        <Cell>{rightColumn.content}</Cell>
      </Row>
    </Table>
  );
};

export default ConfigTable;