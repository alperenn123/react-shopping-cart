import {useState} from 'react';
import { useQuery } from 'react-query';
import Item from './Item/Item';
import { LinearProgress,Grid,Drawer,Badge } from '@material-ui/core';
import { AddShoppingCart } from '@material-ui/icons';
import {Wrapper,StyledButton} from './App.styles';
import Cart from './Cart/Cart';


export type CartItemType = {
  id:number;
  category:string;
  descriptrion:string;
  image:string;
  price:number;
  title:string;
  amount:number
}

const getProducts = async ():Promise<CartItemType[]> => await (await fetch('https://fakestoreapi.com/products')).json()

const App = () => {
  const [isCartOpen,setIsCartOpen] = useState(false);
  const [cartItems,setCartItems] = useState([] as CartItemType[]);
  const {data,isLoading,error} = useQuery<CartItemType[]>(
    'products',
    getProducts
  )
  console.log("data",data);
  if(isLoading) return <LinearProgress/>;
  if(error) return <div>Eror Occurred: {error}</div>
  const getTotalItems = (items:CartItemType[]) => items.reduce((ack:number,item) => ack + item.amount,0);
  const handleAddToCart = (clickedItem:CartItemType) => {
    setCartItems((prev) => {
        if (prev.length > 0){
          const isItemInCart = prev.find(item => item.id === clickedItem.id);
          if(isItemInCart){
            return prev.map(item => (
              item.id === clickedItem.id ? {...item,amount:item.amount + 1} : item
            ))
          }
          return [...prev,{...clickedItem,amount:1}];
        }else{
          return new Array({...clickedItem,amount:1});
        }
      }
    )
  };
  const handleRemoveFromCart = (id:number) => {
    setCartItems((prev) => {
      if(prev){
        return prev.reduce((ack,item) => {
          if(id === item.id){
            if(item.amount === 1) return ack;
            return [...ack,{...item,amount:item.amount - 1}];
          }else{
            return [...ack,item];
          }
        },[] as CartItemType[])
      }else{
        return [] as CartItemType[];
      }
    })
     
  };
  return (
    <Wrapper>
      <Drawer anchor='right' open={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart} />
      </Drawer>
      <StyledButton onClick={() => setIsCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCart />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
}

export default App;
