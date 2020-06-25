
import { User, CartItem, Item, AvailableInventory } from '../stores';
import { BrowserHeaders } from 'browser-headers';
import { ShoppingCartClient, ServiceError } from '../_proto/shoppingcart_pb_service';
import { AddLineItem, RemoveLineItem, GetShoppingCart, Cart } from '../_proto/shoppingcart_pb';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { GetAvailable, AvailableInventory as ProtoAvailableInventory } from '../_proto/inventory_pb';
import { ProductInventoryClient } from '../_proto/inventory_pb_service';
export class Api{
    store: any = null;

    // Setup cart client
    cart_host = (process.env.CART_SCHEME && process.env.CART_HOST && process.env.CART_PORT) ?
        process.env.CART_SCHEME + "://" + process.env.CART_HOST + ":" + process.env.CART_PORT :
        window.location.protocol + "//"+window.location.hostname + (window.location.hostname == "localhost" ? ":" + window.location.port : "");

    cart_client = new ShoppingCartClient(this.cart_host);

    // Setup inventory client
    inventory_host = (process.env.INVENTORY_SCHEME && process.env.INVENTORY_HOST && process.env.INVENTORY_PORT) ?
        process.env.INVENTORY_SCHEME + "://" + process.env.INVENTORY_HOST + ":" + process.env.INVENTORY_PORT :
        window.location.protocol + "//"+window.location.hostname + (window.location.hostname == "localhost" ? ":" + window.location.port : "");

    inventory_client = new ProductInventoryClient(this.inventory_host);

    setStore = (store) => {
        this.store = store;
    }

    addItem = (user: User, item: Item, quantity: number) => {
        const addItem = new AddLineItem();
        addItem.setName(item.name);
        addItem.setProductId(item.id);
        addItem.setQuantity(quantity);
        addItem.setUserId(user.name);
        const metadata = new BrowserHeaders({'x-custom-header-1': 'example'});

        return new Promise<void>( (resolve, reject) => {
            this.cart_client.addItem(addItem, metadata,(err: ServiceError, response: Empty) => {
                console.log("err", err);
                if(err)reject(err);
                else resolve();
            });
        });
    }

    removeItem = (user: User, item: Item, quantity: number) => {
        const remItem = new RemoveLineItem();
        remItem.setProductId(item.id);
        remItem.setUserId(user.name);
        const metadata = new BrowserHeaders({'x-custom-header-1': 'example'});
        return new Promise<void>( (resolve, reject) => {
            this.cart_client.removeItem(remItem, metadata,(err: ServiceError, response: Empty) => {
                console.log("err", err);
                if(err)reject(err);
                else resolve();
            });
        });
    }

    getCart = (user: User)  => {
        const get = new GetShoppingCart();
        const metadata = new BrowserHeaders({'x-custom-header-1': 'example'});
        get.setUserId(user.name);
        return new Promise<CartItem[]>( (resolve, reject) => {
            this.cart_client.getCart(get, metadata,(err: ServiceError, response: Cart) => {
                if(err)reject(err);
                else{
                    const items = response.getItemsList().map( x => ({user: user.name, item: x.getProductId(), quantity: x.getQuantity() } as CartItem) );
                    console.log("got items", items);
                    resolve(items);
                }
            });
        });
    }

    // inventory api
    getAvailableProductInventory = (productId: string) => {
        const getAvailable = new GetAvailable();
        getAvailable.setProductId(productId);
        return new Promise<AvailableInventory>( (resolve, reject) => {
            this.inventory_client.getAvailableProductInventory(getAvailable, (err: ServiceError, response: ProtoAvailableInventory) => {
                if(err) reject(err);
                else {
                    const quantity = response.getQuantity()
                    resolve({quantity: quantity} as AvailableInventory);
                }
            });
        });
    }
}


export default Api;