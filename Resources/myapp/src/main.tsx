import { createRoot } from 'react-dom/client';
import Provider from "react-redux/es/components/Provider";

import store from "./@stores/MyStore";
import Container from "./compoments/Container";

console.log("Hello World")

createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>

        <Container />
    </Provider>
)


