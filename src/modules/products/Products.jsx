import React, {Component} from 'react';
import { Button, Table, Spin, Popconfirm, Modal } from 'antd';
import { Link } from "react-router-dom";


export default class Products extends Component {
    constructor(props){
        super(props)
        this.state = {
            products: [],
            loading: true
        }
        this.onGetData = this.onGetData.bind(this);
    }

    componentDidMount(){
        this.onGetData();
    }

    onGetData(){
        fetch(`${process.env.REACT_APP_PROXY}/products`)
        .then(res => res.json())
        .then(data => this.setState({products: data.Products, loading: false}))
    }

    onDelete(Id) {
        fetch(`${process.env.REACT_APP_PROXY}/products/${Id}`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => this.showModal(data.message))
    }

    showModal(message) {
        let self = this;
        Modal.success({
            title: 'Productos',
            content: `${message}`,
            onOk(){
                self.onGetData()
            }
        });
    }

    getColumns(){
        return [{
            title: 'Producto',
            dataIndex: 'name',
            key: 'name',
        },{
            title: 'Categoria',
            dataIndex: 'category',
            key: 'category',
        },{
            title: 'Ubicación',
            dataIndex: 'location',
            key: 'location',
        },{
            title: 'Precio',
            dataIndex: 'price',
            key: 'price',
        },{
            title: 'Eliminar',
            render: (tag) => (
                <Popconfirm title="Seguro que desea eliminar？" okText="Si" onConfirm={() => this.onDelete(tag._id)} cancelText="No">
                </Popconfirm>
            )
        }]
    }

    getRecords(){
        let {products} = this.state;
        return products;
    }

    render(){
        let {loading} = this.state;
        let {match} = this.props;
        return (
            <div>
                <section>
                    <Link to={`${match.url}/new`}>
                        <Button type="primary" style={{marginBottom: 15}}>
                            Agregar Producto
                        </Button>
                    </Link>
                    <Spin spinning={loading} tip="Cargando">
                        <Table rowKey="_id"
                            columns={this.getColumns()}
                            dataSource={this.getRecords()}
                            pagination={false}
                        />
                    </Spin>
                </section>
            </div>
        )
    }
}
