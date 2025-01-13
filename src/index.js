import React from 'react';
import ReactDOM from 'react-dom/client';
// import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// const element = React.cloneElement('h1', null, 'Hellow')

// let index = 0;
// const element = (
//     <h1 className="heading" tabIndex={index}>
//         Hello to
//     </h1>
// )
//
// setInterval(() => {
//     const elementII = (
//         <h1 className="heading" tabIndex={index}>
//             <span className="text">  Hello to {new Date().toLocaleTimeString()}</span>
//             <img src="" alt=""/>
//
//         </h1>
//     )
//
//     ReactDOM.render(elementII, document.getElementById("root"))
// }, 100)
//
//
//
// // root.render(elementII)
// console.log(element)
// console.log(elementII)

// element = {
//     type: 'h1',
//     props: {
//         className: 'heading',
//         tabIndex: 0,
//         children: "Hello to"
//     }
// }


// elementII = {
//     type: 'h1',
//     props: {
//         className: 'heading',
//         tabIndex: 0,
//         children: [
//             {
//                 type: 'span',
//                 props: {
//                     className: "text"
//                 }
//             },
//             {
//                 type: 'img',
//                 props: {
//                     src: ""
//                 }
//             }
//
//
//         ]
//     }
// }
