import * as React from 'react';
import usePagination from '@mui/material/usePagination';
import { styled } from '@mui/material/styles';

const List = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Button = styled('button')({
  padding: '0.5rem',
  margin: '0.2rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  background: '#fff',
  cursor: 'pointer',
  '&:hover': {
    background: '#f0f0f0',
  },
  '&:focus': {
    outline: 'none',
  },
});

const PreviousButton = styled(Button)({
  background: "#FAFAFA",
  color:"#999999",
  border:"#FAFAFA",
  marginRight:"30px",
  fontSize:"14px",
  fontWeight:"500"
});

const NextButton = styled(Button)({
  background: "rgba(255, 196, 12, 0.05)",
  color:"#FFC40C",
  border:"#FAFAFA",
  marginLeft:"40px",
  fontSize:"14px",
  fontWeight:"500"
});

export default function UsePagination({count,page,onChange,defaultPage}) {
  const { items } = usePagination({
    count: count,
  });

  return (
    <nav>
      <List>
        {items.map(({ page, type, selected, ...item }, index) => {
          let children = null;
          if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            children = '…';
          } else if (type === 'page') {
            children = (
              <Button
                type="button"
                style={{
                  color: selected ? 'white' : '#999999',
                  borderRadius: '50%',
                  backgroundColor: selected ? '#FFC40C' : 'white',
                  fontSize:"14px",
                  marginLeft: '10px',
                  height: '24px',
                  border:"white",
                  width:"24px",
                  display:"flex",
                  justifyItems:"center",
                  alignItems:"center"
                }}
                {...item}

              >
                {page}
              </Button>
            );
          } else if (type === 'previous') {
            children = (
              <PreviousButton type="button" {...item}>
                Previous Page
              </PreviousButton>
            );
          } else if (type === 'next') {
            children = (
              <NextButton type="button" {...item}>
              Next Page
              </NextButton>
            );
          } else {
            children = (
              <Button type="button" {...item}>
                {type}
              </Button>
            );
          }

          return <li key={index}>{children}</li>;
        })}
      </List>
    </nav>
  );
}
