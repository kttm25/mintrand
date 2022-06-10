import styled from "styled-components"

export const Input = styled.input`
    width:97%;
    overflow-wrap: anywhere;
    color: #282c34;
    overflow:hidden;
    margin-bottom: 5%;
    margin-right: 100%;
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
     box-flex: 1; 
    ${(props) =>
      props.isError ? `border-color: red; ` : `border-color: black; border:none`}
`

export const Button = styled.button`
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: block;
    font-size: 16px;
    display: block;
    float:right;
    ${(props) =>
      props.isError ? `border-color: red;` : `border-color: black;  border:none `}
`

export const ResultText = styled.textarea`
  padding: 10px;
  max-width: 100%;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 1px #999;
  width:100%;
`