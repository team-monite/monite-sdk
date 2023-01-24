import React from 'react';
import { Paper, styled } from '@mui/material';
import { palette } from '@team-monite/ui-kit-react';
import ElevationScroll from '../../ElevationScroll';

const StyledHeader = styled(Paper)`
  display: flex;
  align-items: center;
  z-index: 2;
  width: 100%;
  justify-content: center;
  height: ${({ theme }) => theme.spacing(9)};
  border-bottom: 1px solid ${palette.neutral90};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }

  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: ${({ theme }) => theme.spacing(0, 4)};
    position: fixed;
    left: 0;
    top: 0;
    justify-content: flex-start;
  }

  ${({ elevation }) =>
    elevation && 'box-shadow: rgb(0 0 0 / 20%) 0px 2px 4px -1px;'}
`;

export default function OnboardingHeader() {
  return (
    <ElevationScroll endElevation={1}>
      <StyledHeader square>
        <img
          alt={'Logo'}
          src={
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAAgCAYAAABNXxW6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAU3SURBVHgB7VppKKZdGL4ZM9NMzVqaGjMyzUyzNR+FskRKtk8oa8r6w1bKX0UZEn5I8ku2+EHJH6QQsoRIRIqEsn6WbMm+ne++j3mf3vM+z/N634wv85mrbr3nnPuc85zrnHs5zwPgEuYoP1CmUc5Q2P9YaH0zKBkoVj/XD7Yoy7f8wW9K/kH5ywT/zKNYwt3FMpHA4I7DFP4AzOAWIiAgAF68eCGV6+vrYWdnB24St85hzczMMG18/fr1Ruf7Yw5ggDmYmJiAh4cHfP/+HaysrAA3BhYXF2FkZAQGBgZgf39fpu/m5gZPnjyR6np6evhxtrW1BRcXF3j//j2cnJzA6OgotLa2wvr6ut5ncHV1hQ8fPkhjPXv2DKytraX24+NjaG9vh/Pzc1lfCwsLPq8Gk5OTMD09LdNTPSbOzs5sbm6OqQEHZLgooY+ZmRlDkgS9b9++seLiYsUxtra2+Dygxxy0gRvB3rx5w05PT6W6o6MjZmdnp7iGuro6ob+jo6OSnjIBKSkpwkRqIJ2oqCi9JOAu6R1jfn6evXr1ymASSAdPkFBfXl4uWwORdXh4KOngyWV4Ug0jAY8a293dlTrv7e2x7OxshseKS1paGmdfg+XlZfb27VtVEvCYMjQb1tvby1paWvju6yIpKUmVBNrNsrIyLs+fP+c6np6egg6am2yBQUFBgk5kZKTaqRcraKChoSGhc1hYmKxjdHS0oFNYWKhKwuzsrESSRqe/v1/QaWxsNCo60BjoH/Qusru7W2pbWlpiDx48MIwEGxsbdnFxIXUmn3D//n1ZR3RObHV1VdKjB1cjITQ0VNY/Pj5e0BkeHjaKBKWNQEcrtX369ElYB/kkNdOXRQd7e3vu4TWg3wUFBaAEJEf6jfYHapiampLVUYTRBu4SGIuamhooKiqCp0+f8jJFDAcHBx61EhISpHUgGVBaWqo6joyEly9fCmVLS0tITk6Gq/Dw4UO+EJpQFxQOdYGbA9cFOmXIycmBvLw8qS4uLg4GBwfBx8dHqqPwSSFdDVfmCRTfr4rjGpiamiqScJMoKSkBdNRSXuLl5QX+/v7w+fNnSaeiokIv6TISMCoIZWIxJCQEDAX6BPgvsb29DdXV1ZCYmMjLlBxpH33awI6ODr1jyJ54fHyc7ybtKgGTEG5zuuQQKJOkSTWorKyEm4C2j1IChk5AJwmPHj3iZXNzc6mttrYWNjY24CoInhIHYmNjY4LXRTuTeVT0FTz2a0CRAlSiw5cvX2T9vb29BR0kX2qbmJgQ2nx9fVU9O/wM601NTUwXZ2dn7OPHj3r7glqyhLm6LFtsbm5mERERLDg4mKWnp7OVlRWhPTU19ZeRoJvqUrJFOQE6PBYTE6O4ECcnJxkJXV1dhhCgTAJJZmYmn9wQUBaIjumXkeDn58cODg4U56JEDk1V8TSg/Qu6sbGx1yOBBG2eX5LUQHl5fn4+NyHQyuSuSwItKDc3V3ETFhYWhOxTI5QNahNHhGDYNoiEK98xUuynBARti1+l7927xx0NpqHQ1tbGvbM2yKG6u7sLiVRnZycgYYLe69evAbNTqby5ucnjuzZoTpr73bt3PNfATBIaGhp4fqCL8PBwnjxpkJGRAVlZWWAo2O8udHL6+vqkU0DpMl0CjRjjdi7MGMFUXzAZujgZOcbtW5SxUlVVJZAQGBh4t0h4/Pix8PaLbqDajtoQ+e0/vlCWqHn/SFhbWzP4rqMBkbCEYgF3Fwt0QfgbZQXuJuiDbKCmYAWXn6rpk/Vd+DRP79x/wOW/JMC/kHigG8PIsWcAAAAASUVORK5CYII='
          }
        />
      </StyledHeader>
    </ElevationScroll>
  );
}
