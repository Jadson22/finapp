import React, { Component } from 'react';
import { Modal, Alert, View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RadioForm from 'react-native-simple-radio-button';
import db from './../config/firebaseConfig';
import styles from './styles';

export default class Main extends Component {
    dbRef = db.ref('/transaction');

    static navigationOptions = {
        title: "FinApp"
    };

    radios = [
        { label: "Entry", value: 0 },
        { label: "Outflow", value: 1 },
    ];

    state = {
        currentBalance: 0.0,
        entries: [],
        outflows: [],
        createModalVisible: false,
        editModalVisible: false,
        radioMode: 0,
        transactionName: '',
        transactionValue: 0.0,
        transactionDate: new Date().getDate(),
        transactionMonth: new Date().getMonth() + 1,
        transactionYear: new Date().getFullYear(),
        editKey: '',
        editName: '',
        editValue: '',
        editType: 0,
        editDate: '',
        editMonth: '',
        editYear: '',
    };

    componentDidMount() {
        this.loadEntries();
        this.loadOutflows();
        this.updateCurrentBalance();
    }

    setEditModalVisible(visible) {
        this.setState({ editModalVisible: visible });
    }

    setCreateModalVisible(visible) {
        this.setState({ createModalVisible: visible });
    }


    saveTransaction() {
        this.dbRef.push({
            name: this.state.transactionName,
            value: parseFloat(this.state.transactionValue, 10).toFixed(2),
            type: this.state.radioMode,
            date: this.state.transactionDate,
            month: this.state.transactionMonth,
            year: this.state.transactionYear
        });
    }

    updateTransaction(key) {
        db.ref('/transaction/').child(key).set({
            name: this.state.editName,
            value: this.state.editValue,
            type: this.state.editType,
            date: this.state.editDate,
            month: this.state.editMonth,
            year: this.state.editYear,
        });
    }

    deleteTransaction(key) {
        db.ref('/transaction/').child(key).set(null);
    }

    resetAll() {
        db.ref('/transaction/').set(null);
    }

    updateCurrentBalance() {
        this.dbRef.on("value", dataSnapshot => {
            var dbData = [];
            dataSnapshot.forEach(child => {
                dbData.push({
                    name: child.val().name,
                    value: child.val().value,
                    type: child.val().type,
                    date: child.val().date,
                    month: child.val().month,
                    year: child.val().year,
                    key: child.key
                });
            });

            let currBalance = dbData.reduce((prev, elem) => {
                if (elem.type == 0) return prev + parseFloat(elem.value)
                else return prev - elem.value
            }, 0);

            this.setState({
                currentBalance: currBalance.toFixed(2).toString().replace(".", ",")
            });
        });
    }

    loadEntries() {
        this.dbRef.on("value", dataSnapshot => {
            var dbData = [];
            dataSnapshot.forEach(child => {
                dbData.push({
                    name: child.val().name,
                    value: child.val().value,
                    type: child.val().type,
                    date: child.val().date,
                    month: child.val().month,
                    year: child.val().year,
                    key: child.key
                });
            });

            let entriesList = dbData.filter((transaction) => {
                return transaction.type == 0;
            });

            this.setState({
                entries: entriesList
            });
        });
    }

    loadOutflows() {
        this.dbRef.on("value", dataSnapshot => {
            var dbData = [];
            dataSnapshot.forEach(child => {
                dbData.push({
                    name: child.val().name,
                    value: child.val().value,
                    type: child.val().type,
                    date: child.val().date,
                    month: child.val().month,
                    year: child.val().year,
                    key: child.key
                });
            });

            let outflowsList = dbData.filter((transaction) => {
                return transaction.type == 1;
            });

            this.setState({
                outflows: outflowsList
            });
        });
    }

    renderEntries = ({ item }) => (
        <View style={styles.entryCard}>
            <Text style={styles.cardValue}>R$ {parseFloat(item.value).toFixed(2).replace('.', ',')}</Text>
            <Text numberOfLines={2} style={styles.cardName}>{item.name}</Text>

            <View>
                <View style={styles.editIcons}>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            editKey: item.key,
                            editName: item.name,
                            editType: item.type,
                            editValue: item.value,
                            editDate: item.date,
                            editMonth: item.month,
                            editYear: item.year
                        });                        
                        this.setEditModalVisible(!this.state.editModalVisible);
                    }}>
                        <Icon name="edit" size={25} color="#F5F5F5" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        Alert.alert(
                            'Reset Card',
                            'Are you shure you want to reset this card?',
                            [
                                {
                                    text: 'No',
                                    onPress: () => { },
                                    style: 'cancel',
                                },
                                {
                                    text: 'Yes', onPress: () => {
                                        this.deleteTransaction(item.key);
                                        this.loadEntries();
                                    }
                                },
                            ],
                            { cancelable: false },
                        );
                    }}>
                        <Icon name="delete" size={25} color="#F5F5F5" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.cardDate}>{item.month}/{item.date}/{item.year}</Text>
            </View>
        </View>
    );

    renderOutflows = ({ item }) => (
        <View style={styles.outflowCard}>
            <Text style={styles.cardValue}>R$ {parseFloat(item.value).toFixed(2).replace('.', ',')}</Text>
            <Text numberOfLines={2} style={styles.cardName}>{item.name}</Text>

            <View>
                <View style={styles.editIcons}>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            editKey: item.key,
                            editName: item.name,
                            editType: item.type,
                            editValue: item.value,
                            editDate: item.date,
                            editMonth: item.month,
                            editYear: item.year
                        });
                        this.setEditModalVisible(!this.state.editModalVisible)
                    }}>
                        <Icon name="edit" size={25} color="#F5F5F5" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        Alert.alert(
                            'Reset Card',
                            'Are you shure you want to reset this card?',
                            [
                                {
                                    text: 'No',
                                    onPress: () => { },
                                    style: 'cancel',
                                },
                                {
                                    text: 'Yes', onPress: () => {
                                        this.deleteTransaction(item.key);
                                        this.loadEntries();
                                    }
                                },
                            ],
                            { cancelable: false },
                        );

                    }}>
                        <Icon name="delete" size={25} color="#F5F5F5" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.cardDate}>{item.month}/{item.date}/{item.year}</Text>
            </View>

        </View>
    );

    render() {
        return (
            <View style={styles.container}>
                {/* Create Modal */}
                <Modal
                    transparent={true}
                    style={styles.createModal}
                    onRequestClose={() => { this.setCreateModalVisible(!this.state.createModalVisible) }}
                    animationType="fade"
                    visible={this.state.createModalVisible}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalHeaderText}>Add Transaction</Text>
                            <View style={styles.modalRadios}>
                                <Text>Type:</Text>
                                <RadioForm
                                    initial={this.state.radioMode}
                                    radio_props={this.radios}
                                    buttonSize={10}
                                    onPress={(value) => { this.setState({ radioMode: value }) }}
                                    formHorizontal={true}
                                    labelStyle={styles.radioForm}
                                />
                            </View>
                            <View style={styles.inputView}>
                                <Text>Name: </Text>
                                <TextInput
                                    onChangeText={(text) => {
                                        this.setState({ transactionName: text });
                                    }}
                                    style={{ height: 35, backgroundColor: "#fff", flex: 1 }}
                                ></TextInput>
                            </View>
                            <View style={styles.inputView}>
                                <Text>Value: </Text>
                                <Text style={styles.rs}>R$</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    onChangeText={(text) => {
                                        this.setState({ transactionValue: text });
                                    }}
                                    style={{ height: 35, backgroundColor: "#fff", flex: 1 }}
                                ></TextInput>
                            </View>
                            <View style={styles.inputView}>
                                <Text>Date: </Text>
                                <Text style={styles.modalDate}>{this.state.transactionMonth}/{this.state.transactionDate}/{this.state.transactionYear}</Text>
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => { this.setCreateModalVisible(!this.state.createModalVisible) }}>
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                    <Icon name="cancel" size={25} color="#f5f5f5" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={() => {
                                        this.saveTransaction();
                                        this.loadEntries();

                                        this.setCreateModalVisible(!this.state.createModalVisible);
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>Save</Text>
                                    <Icon name="save" size={25} color="#f5f5f5" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    transparent={true}
                    style={styles.createModal}
                    onRequestClose={() => { }}
                    animationType="fade"
                    visible={this.state.editModalVisible}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalHeaderText}>Edit Transaction</Text>
                            <View style={styles.modalRadios}>
                                <Text>Type:</Text>
                                <RadioForm
                                    initial={this.state.editType}
                                    radio_props={this.radios}
                                    buttonSize={10}
                                    onPress={(value) => { this.setState({ editType: value }) }}
                                    formHorizontal={true}
                                    labelStyle={styles.radioForm}
                                />
                            </View>
                            <View style={styles.inputView}>
                                <Text>Name: </Text>
                                <TextInput
                                    defaultValue={this.state.editName}
                                    onChangeText={(text) => {
                                        this.setState({ editName: text });
                                    }}
                                    style={{ height: 35, backgroundColor: "#fff", flex: 1 }}
                                ></TextInput>
                            </View>
                            <View style={styles.inputView}>
                                <Text>Value: </Text>
                                <Text style={styles.rs}>R$</Text>
                                <TextInput
                                    defaultValue={this.state.editValue}
                                    onChangeText={(text) => {
                                        this.setState({ editValue: text });
                                    }}
                                    style={{ height: 35, backgroundColor: "#fff", flex: 1 }}
                                ></TextInput>
                            </View>
                            <View style={styles.inputView}>
                                <Text>Date: </Text>
                                <Text style={styles.modalDate}>{this.state.editMonth}/{this.state.editDate}/{this.state.editYear}</Text>
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => { this.setEditModalVisible(!this.state.editModalVisible) }}>
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                    <Icon name="cancel" size={25} color="#f5f5f5" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.saveButton} onPress={() => {
                                    this.updateTransaction(this.state.editKey);
                                    this.loadEntries();
                                    this.setEditModalVisible(!this.state.editModalVisible);
                                }}>
                                    <Text style={styles.modalButtonText}>Save</Text>
                                    <Icon name="save" size={25} color="#f5f5f5" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>

                <Text style={styles.textContainer}>Current Balance</Text>
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceText}>R$ {this.state.currentBalance}</Text>
                </View>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.boardsContainer}>
                    {/*Entries*/}
                    <View style={styles.entriesListContainer}>
                        <View style={styles.entriesHeader}>
                            <Text style={styles.entriesText}>Entries</Text>
                            <TouchableOpacity onPress={() => {
                                this.setState({ radioMode: 0 });
                                this.setCreateModalVisible(!this.state.createModalVisible);
                            }}>
                                <Icon name="add-circle" size={25} color="#222" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            contentContainerStyle={styles.entriesList}
                            data={this.state.entries}
                            keyExtractor={(item, key) => {
                                return key.toString();
                            }}
                            renderItem={this.renderEntries}
                        />
                    </View>

                    {/*Outflows*/}
                    <View style={styles.outflowsListContainer}>
                        <View style={styles.outflowsHeader}>
                            <Text style={styles.outflowsText}>Outflows</Text>
                            <TouchableOpacity onPress={() => {
                                this.setState({ radioMode: 1 });
                                this.setCreateModalVisible(!this.state.createModalVisible);
                            }}>
                                <Icon name="add-circle" size={25} color="#222" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            contentContainerStyle={styles.outflowsList}
                            data={this.state.outflows}
                            keyExtractor={(item, key) => {
                                return key.toString();
                            }}
                            renderItem={this.renderOutflows}
                        />
                    </View>

                </ScrollView>

                <TouchableOpacity onPress={() => {
                    Alert.alert(
                        'Reset All',
                        'Are you shure you want to reset all cards?',
                        [
                            {
                                text: 'Cancel',
                                onPress: () => { },
                                style: 'cancel',
                            },
                            {
                                text: 'OK', onPress: () => { this.resetAll() }
                            },
                        ],
                        { cancelable: false },
                    );
                }}>
                    <Text style={styles.resetText}>Reset All</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

