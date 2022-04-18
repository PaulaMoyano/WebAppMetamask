import { useWeb3React } from '@web3-react/core'; //importo todo lo necesario.
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button'; //estilos con bootstrap.
import Card from 'react-bootstrap/Card'; //estilos con bootstrap.
import {injected} from "../components/wallet/connectors";
import "./index.css" //estilos del div container.

const Index = () => { //componente Index.

    const { active, account, library, activate, deactivate } = useWeb3React()
    const [balance, setBalance] = useState(0)
    const [block, setBlock] = useState(0)

    const updateData = (newBlock) => { //fn q le llega por parametro un nuevo bloque.
        library.eth.getBalance(account).then( (newBalance) => {
            setBalance(library.utils.fromWei(newBalance))
        } ) //getBalance recibe x parametro el account. 
        setBlock(newBlock.number)
    }

    useEffect( () => { //fn como primer parametro, y un array de dependencias como segundo parametro.
        if(active) {
            library.eth.getBlock().then(updateData)

            library.eth.subscribe('newBlockHeaders').on('data', updateData)
        }
    }, [active, account] )

    const connect = () => { //fn asincronica para conectar.
        activate(injected).catch((error) => {
            console.log(error)
        })
    }

    const disconnect = () => { //fn asinc para desconectar.
        deactivate().catch((error) => {
          console.log(error)
        })
    }


  return ( //render: + container en css para dar estilos.
    <div className="container"> 
      {active ? <Button variant="primary" onClick={disconnect}>Disconnect</Button> : <Button variant="primary" onClick={connect}>Connect to MetaMask</Button>}
      
      {active ? 
        <Card>
            <Card.Header as="h5">Connected with <b> {account}  </b></Card.Header>
            <Card.Body>
                <Card.Text>
                Balance: {balance}
                </Card.Text>
                <Card.Text>
                Block: {block}
                </Card.Text>
            </Card.Body>
        </Card>
       : <p className='text-white'> <b> Not connected </b> </p>}
    </div>
  );
}

export default Index; //export componente Index.
