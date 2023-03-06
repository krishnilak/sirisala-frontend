import { Container, Message, Table, Button, Modal, Form } from 'semantic-ui-react';
import React, { useState, useEffect } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";

export default function Admin() {
    const [items, setItems] = useState([]);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const { state, httpRequest } = useAuthContext();
    const [isPermitted, setPermission] = useState(false);
    const tempItem = {
        item_id: "",
        item_name: "",
        item_desc: "",
        item_includes: "",
        item_image_url: "",
        quantity: "",
        item_price: 0
    };

    const [newItem, setNewItem] = useState(tempItem);
    const baseUrl = 'http://localhost:8080/api';

    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        method: "GET",
        url: baseUrl + '/items',
        attachToken: false,
        withCredentials: false
    };

    useEffect(() => {
        console.log(state.allowedScopes);
        console.log(state.username);

        //if the allowedScopes has the ADD_ITEMS_SCOPE permission
        // if (state.allowedScopes.includes('urn:petstorekla:petstore:likeitem')) {
        if (state.username == 'klakrishni@gmail.com') {

                async function fetchItems() {
                    const response = await httpRequest(requestConfig);
                    setItems(response.data);
                }
                fetchItems();
                setPermission(true);
            }

    }, []);

    useEffect(() => {
        document.title = "Admin | Sirisala Web Store"
    }, []);

    const handleNewItemChange = (event) => {
        const { name, value } = event.target;
        const newValue = name === 'price' ? Number(value) : value;
        setNewItem((prevNewItem) => ({
            ...prevNewItem,
            [name]: newValue
        }));

        if (selectedItem) {
            setSelectedItem((prevSelectedItem) => ({
                ...prevSelectedItem,
                [name]: newValue
            }));
        }
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setNewItem(item);
        setShowAddItemModal(true);
    };

    const handleAddItem = (item) => {
        setSelectedItem(null);
        setNewItem(tempItem);
        setShowAddItemModal(true);
        // setShowAddItemModal(true);
    };




    const handleAddItemSubmit = async () => {
        const requestConfig = {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*,http://localhost:3000"
            },
            method: selectedItem ? "PATCH" : "POST",
            url: baseUrl + '/items' + (selectedItem ? '/' + selectedItem.id  : ''),
            data: selectedItem ? selectedItem : [newItem],
            withCredentials: false
        };

        httpRequest(requestConfig)
            .then((response) => {
                console.log(response);
                if (selectedItem) {
                    setItems((prevItems) => prevItems.map((item) => item.id === selectedItem.id ? response.data : item));
                } else {
                    setItems((prevItems) => [...prevItems, response.data[0]]);
                }
                setShowAddItemModal(false);
                setSelectedItem(null);
                setNewItem(tempItem);
            })
            .catch((error) => {
                console.error(error);
            });
    };


    return (
        // if isPermitted is false show you are not authorized  message
        !isPermitted ?
            <Container>
                <Message negative>
                    <Message.Header>Access Denied</Message.Header>
                    <p>You do not have permission to access this page.</p>
                </Message>
            </Container>
            :
            <>
                <Container className="mt-5">
                    <Table bordered hover>
                        <thead>
                            <tr>

                                <th scope="col" width="150px">Title</th>
                                <th scope="col" width="400px">Description</th>
                                <th scope="col">Includes</th>
                                <th scope="col" width="50px">Image URL</th>
                                <th scope="col">Available Quantity</th>
                                <th scope="col">Price</th>
                                <th scope="col">&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.item_id} className="align-middle">
                                    <td>{item.item_name}</td>
                                    <td>{item.item_desc}</td>
                                    <td>{item.item_includes}</td>
                                    <td>{item.item_image_url}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.item_price}</td>
                                    <td>
                                        <Button variant="primary" size="sm">Edit</Button>&nbsp;
                                        <Button variant="danger" size="sm">Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button onClick={() => { handleAddItem({}); }}>Add Item</Button>
                </Container>
                <Modal open={showAddItemModal} onClose={() => setShowAddItemModal(false)}>

                    <Modal.Header>{selectedItem ? 'Edit Item' : 'Add Item'}</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>ID</label>
                                <input type="text" name="id" value={newItem.item_id} onChange={handleNewItemChange} />
                            </Form.Field>
                            <Form.Field>
                                <label>Title</label>
                                <input type="text" name="item_name" value={newItem.item_name} onChange={handleNewItemChange} />
                            </Form.Field>
                            <Form.Field>
                                <label>Description</label>
                                <input type="text" name="description" value={newItem.item_desc} onChange={handleNewItemChange} />
                            </Form.Field>
                            <Form.Field>
                                <label>Includes</label>
                                <input type="text" name="includes" value={newItem.item_includes} onChange={handleNewItemChange} />
                            </Form.Field>
                            <Form.Field>
                                <label>Intended For</label>
                                <input type="text" name="img_url" value={newItem.item_image_url} onChange={handleNewItemChange} />
                            </Form.Field>
                            <Form.Field>
                                <label>Color</label>
                                <input type="text" name="quntity" value={newItem.quantity} onChange={handleNewItemChange} />
                            </Form.Field>
                            <Form.Field>
                                <label>Price</label>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => setShowAddItemModal(false)}>Cancel</Button>
                        <Button onClick={handleAddItemSubmit}>{selectedItem ? 'Save' : 'Add'}</Button>
                    </Modal.Actions>
                </Modal>
            </>
    );
}

