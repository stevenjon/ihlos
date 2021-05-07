import React, {Component} from 'react';
import {Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import "./App.scss"
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "react-js-pagination";
import {TinyButton as ScrollUpButton} from "react-scroll-up-button";

class Home extends Component {
    componentDidMount() {
        this.getDrugs()
    }

    getDrugs() {
        axios.get("https://spravochnikihlos.uz/medikament/get_dorilar.php").then(res => {
            // axios.get("https://jsonplaceholder.typicode.com/users").then(res => {
            if (res.status === 200) {
                let page = []
                this.setState({drugList: res.data})
                if (res.data && res.data.length > 1000) {
                    page = res.data.slice(0, 1000)
                } else {
                    page = res.data
                }
                this.setState({drugList: res.data, drugs: page, page: 0, size: 1000, totalItems: res.data.length})
            }
        })
    }

    state = {
        totalItems: 0,
        size: 0,
        page: 0,
        drugs: [],
        drugList: [],
        items: [],
        selectDrugs: [],
        searchDrugs: []
    }

    handlePageChange(pageNumber) {
        if (pageNumber >= 0) {
            let page = pageNumber - 1
            if (this.state.drugList && this.state.drugList.length > this.state.size * (page)) {
                let size = this.state.size
                this.setState({drugs: this.state.drugList.slice(page * size, (page * size) + size), page})
            }
        }
    }

    render() {
        const {openModal} = this.state;

        const send = (e, v) => {
            let orgName = document.getElementById('orgName').value
            let phoneNumber = document.getElementById('phoneNumber').value
            if (orgName && orgName.length > 0 && phoneNumber && phoneNumber.length >= 9) {
                let obj = [{orgName, phoneNumber, drugs: this.state.items}]
                obj = JSON.stringify(obj)
                let formData = new FormData();
                formData.append('json', obj);
                axios.post("https://spravochnikihlos.uz/ihlos/excel.php", formData).then(res => {
                    // if (res.data === 111) {
                    //     alert("Ma'lumot muvaffaqiyatli jo'natildi!")
                    // } else {
                    //     alert("Xatolik!")
                    // }
                })
                alert("Ma'lumot muvaffaqiyatli jo'natildi!")
                this.setState({openModal: false, items: [], drugs: [], drugList: []})
                this.getDrugs()
            } else {
                alert("Bo'sh maydonchalarni to'ldiring!")
            }
        }
        const showModal = () => {
            this.setState({openModal: !openModal})
        }
        const searchDrugChange = () => {
            let item = document.getElementById('searchWord').value
            if (item && item.length > 0) {
                let drs = this.state.drugList
                let newDrugList = []
                for (let i = 0; i < drs.length; i++) {
                    if (drs[i].nomi.toLowerCase().indexOf(item.toLowerCase()) >= 0) {
                        newDrugList.push(drs[i])
                    }
                }
                let page = []
                if (newDrugList && newDrugList.length > 1000) {
                    page = newDrugList.slice(0, 1000)
                } else {
                    page = newDrugList
                }
                this.setState({drugList: newDrugList, drugs: page, page: 0, size: 1000, totalItems: newDrugList.length})
            } else {
                this.getDrugs()
            }
        }
        const addDrug = (item) => {
            let drugs = new Set(this.state.items);
            if (drugs.has(item)) {
                drugs.delete(item)
            } else {
                drugs.add(item)
            }
            this.setState({items: [...drugs]})
        }
        return (
            <div className="w-100 pt-1">
                <div className="row mt-2 mx-0">
                    <div className="col-md-5 col-md-12 mx-auto ">
                        <div className={"sticky-top bg-white pt-2"}>
                            <div className="basket-block text-right mb-3">
                                <div className="m-2 d-inline mr-auto pr-5">
                                    <button className={"btn btn-success"}
                                            onClick={showModal}>Jo'natish <span
                                        className={"icon icon-send bg-white"}></span>
                                    </button>
                                </div>
                                <span className="icon icon-cart basket bg-success"></span>
                                <div className="select-count">
                                    <span>{this.state.items && this.state.items.length}</span>
                                </div>
                            </div>
                            <div className="">
                                <Input className="form-control" id={'searchWord'} type={"search"}
                                       onChange={searchDrugChange} placeholder={"Qidirish..."}/>
                            </div>
                        </div>
                        <Table className={"table-style w-100 table-bordered mt-2"}>
                            <thead>
                            <tr className={"bg-success text-white"}>
                                <th>№</th>
                                <th>Dori nomi</th>
                                {/*<th>Tanlash</th>*/}
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.drugs && this.state.drugs.length > 0 && this.state.drugs.map((item, i) =>
                                <tr key={i}
                                    className={" drug-tr " + (this.state.items.some(d => d.nomi === item.nomi) ? " active-tr" : "")}
                                    onClick={() => addDrug(item)}>
                                    <td width="7%">{i + 1}</td>
                                    <td width="85%">{item.nomi}</td>
                                    {/*<td width="5%">*/}
                                    {/*    <label className="container">*/}
                                    {/*        <input type="checkbox"*/}
                                    {/*               disabled*/}
                                    {/*            // onClick={() => addDrug(item)}*/}
                                    {/*               checked={this.state.items.some(d => d.nomi === item.nomi)}/>*/}
                                    {/*        <span className="checkmark"></span>*/}
                                    {/*    </label>*/}
                                    {/*</td>*/}
                                </tr>
                            )}
                            </tbody>
                        </Table>
                        <div className="text-center page-block mx-auto">
                            <Pagination
                                activePage={this.state.page + 1}
                                itemsCountPerPage={this.state.size}
                                totalItemsCount={this.state.totalItems}
                                pageRangeDisplayed={5}
                                onChange={this.handlePageChange.bind(this)} itemClass="page-item"
                                linkClass="page-link"
                                className={"text-center mx-auto"}
                            />
                        </div>
                    </div>
                    {/*<div className="col-md-5 col-md-12 mx-auto ">*/}
                    {/*    <div className="m-2">*/}
                    {/*        <button className={"btn btn-success"}*/}
                    {/*                onClick={showModal}>Jo'natish*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*    <Table className={"table-style w-100 mt-2 table-bordered"}>*/}
                    {/*        <thead>*/}
                    {/*        <tr className={"bg-success text-white"}>*/}
                    {/*            <th>№</th>*/}
                    {/*            <th>Dori nomi</th>*/}
                    {/*            /!*<th>Tanlash</th>*!/*/}
                    {/*        </tr>*/}
                    {/*        </thead>*/}
                    {/*        <tbody>*/}
                    {/*        {this.state.items && this.state.items.length > 0 && this.state.items.map((item, i) =>*/}
                    {/*            <tr key={i}*/}
                    {/*                onClick={() => addDrug(item)}>*/}
                    {/*                <td width="10%">{i + 1}</td>*/}
                    {/*                <td>{item.nomi}</td>*/}
                    {/*                /!*<td width="10%">*!/*/}
                    {/*                /!*    <label className="container">*!/*/}
                    {/*                /!*        <input type="checkbox"*!/*/}
                    {/*                /!*               disabled*!/*/}
                    {/*                /!*               checked={this.state.items.some(d => d.nomi === item.nomi)}/>*!/*/}
                    {/*                /!*        <span className="checkmark"></span>*!/*/}
                    {/*                /!*    </label>*!/*/}
                    {/*                /!*</td>*!/*/}
                    {/*            </tr>*/}
                    {/*        )}*/}
                    {/*        </tbody>*/}
                    {/*    </Table>*/}
                    {/*</div>*/}
                </div>
                <ScrollUpButton/>
                <Modal isOpen={openModal} toggle={() => showModal("")} className={""}>
                    <ModalHeader isOpen={openModal} toggle={() => showModal("")}
                                 charCode="X">Ro'yhatni yuborish</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={send}>
                            <FormGroup>
                                <Label for="exampleEmail">Firma nomi</Label>
                                <Input type="text" nomi="org" id="orgName" placeholder=""/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">Telefon raqam</Label>
                                <Input type="tel" nomi="telefon" id="phoneNumber"
                                       placeholder=""/>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color={"success"} onClick={send}>Jo'natish <span
                            className={"icon icon-send bg-white"}></span></Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

Home
    .propTypes = {};

export default Home;
