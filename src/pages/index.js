import { useWeb3React } from '@web3-react/core'; //importo todo lo necesario.
import { useEffect, useState } from 'react'; //importo de react.
import Button from 'react-bootstrap/Button'; //estilos con bootstrap.
import Card from 'react-bootstrap/Card'; //estilos con bootstrap.
import {injected} from "../components/wallet/connectors";
import { useContract } from '../hooks/web3';
import "./index.css" //estilos del div container.
import CounterAbi from "../contracts/abi.json"; //abi.

const contractAddress = "0xa990426c197af9cE3CF79902059Da47a93372252";
const defaultAccount = "0x8eBB972539b541B2fAe723FC09d75D5d3dEA1F08"; //cuenta publica de account3 metamask.


const Index = () => { //componente Index.
    const [greet, setGreet] = useState("")
    const web3 = useWeb3React()
    const { active, account, library, activate, deactivate } = web3

    const contract = useContract(web3, CounterAbi, contractAddress);
    console.log('contract', contract)
    

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

    const onGreet = () => {
        contract.methods.greet().call( { from: defaultAccount } ).then(resp => console.log('response', resp)).catch(err => console.log('err', err))
    }

    const onChangeGreet = e => setGreet(e.target.value)

    const onSetGreet = () => {
        contract.methods.setGreeting(greet).send( { from: defaultAccount } ).then(() => setGreet("")).catch(err => console.log('err', err))
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
                {contract ? <Card.Text>
                    <Button variant='primary' onClick={onGreet}>Greet</Button>
                    <input value={greet} onChange={onChangeGreet} />
                    <Button variant='secondary' onClick={onSetGreet}>SetGreet</Button>
                </Card.Text> : null}
            </Card.Body>
        </Card>
       : <p className='text-white'> <b> Not connected </b> </p>}
    </div>
  );
}

export default Index; //export componente Index.
