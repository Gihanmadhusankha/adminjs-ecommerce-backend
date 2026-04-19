import React, { useState, useEffect } from 'react'
import { Box, Button, Table, TableHead, TableRow, TableCell, TableBody, Input, Icon, Select } from '@adminjs/design-system'
import { ApiClient } from 'adminjs'

const api = new ApiClient()

const OrderItems: React.FC<any> = (props) => {
  const { record, onChange } = props
  const [items, setItems] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  // Load products to show in dropdown
  useEffect(() => {
    api.resourceAction({ resourceId: 'Product', actionName: 'list' }).then(response => {
      setProducts(response.data.records)
    })
  }, [])

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0 }])
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    
    
    if (field === 'productId') {
      const selectedProd = products.find(p => p.id === value)
      if (selectedProd) newItems[index].price = selectedProd.params.price
    }

    setItems(newItems)
    

    onChange('orderItems', newItems)
    

    const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    onChange('totalAmount', total)
  }

  return (
    <Box mt="xl" mb="xl">
      <H3>Order Items</H3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Subtotal</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Select
                  value={item.productId}
                  options={products.map(p => ({ value: p.id, label: p.params.name }))}
                  onChange={(val) => handleItemChange(index, 'productId', val.value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Text>${item.price}</Text>
              </TableCell>
              <TableCell>
                <Text>${item.price * item.quantity}</Text>
              </TableCell>
              <TableCell>
                <Button color="danger" onClick={() => {
                   const filtered = items.filter((_, i) => i !== index)
                   setItems(filtered)
                   onChange('orderItems', filtered)
                }}>
                  <Icon icon="Trash2" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button mt="md" onClick={addItem} type="button">
        <Icon icon="Plus" /> Add Product
      </Button>
    </Box>
  )
}

export default OrderItems