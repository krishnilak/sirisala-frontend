import React, { useState, useEffect } from 'react';
import { Container, Input, Card, Button } from 'semantic-ui-react';
import ItemCard from './ItemCard';
import { useAuthContext } from "@asgardeo/auth-react";

function Catelog({cart, handleAddToCart, handleRemoveFromCart}) {

  const [items, setitems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const baseUrl = "http://localhost:8080/api";

  const { state, httpRequest } = useAuthContext();
  var path = "/items";
  var isAttachToken = false;
  var isWithCredentials = false;
  //* if the user is not authenticated define a separate URL
  // if (state.isAuthenticated) {
  //   path = "/itemsforuser";
  //   isAttachToken = true;
  //   // isWithCredentials = true;
  // }
  const requestConfig = {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    method: "GET",
    url: baseUrl + path,
    attachToken: isAttachToken,
    withCredentials: isWithCredentials
  };

  useEffect(() => {
    async function fetchitems() {
      console.log('baseUrl', baseUrl);
      const response = await httpRequest(requestConfig);
      console.log("AAA");
      console.log(response.data);
      console.log("AAA");
      setitems(response.data);
      console.log(setitems);
    }

    fetchitems();
  }, []);

  useEffect(() => {
    const results = items.filter(item =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [items, searchTerm]);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container>

      {/* <Button content={`Cart (${cart.length})`} icon="cart" labelPosition="right" onClick={() => console.log(cart)} /> */}
      <Card.Group itemsPerRow={4}>
        {searchResults.map(item => (
          <ItemCard cardItem={item} 
          isAuthenticated={state.isAuthenticated} 
          loggedInUserId={state.sub}
          cart={cart} 
          handleAddToCart={handleAddToCart} 
          handleRemoveFromCart={handleRemoveFromCart} />
        ))}
      </Card.Group>
    </Container>
  );
}

export default Catelog;
