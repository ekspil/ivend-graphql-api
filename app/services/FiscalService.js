const axios = require('axios');

module.exports = {

    getToken: async function(login, pass){

        let axConf = {
            method: 'get',
            baseURL: 'https://umka365.ru/kkm-trade/atolpossystem/v4/getToken',
            params: {
                'login': login,
                'pass': pass
            }

        };
        return await axios(axConf)
            .then((response)=>{
                return response.data.token;
            })
            .catch((err)=>{
                console.log(err);
                return null;
            });

    },
    sendCheck: async function (check, token) {

        let axConf = {
            method: 'post',
            baseURL: 'https://umka365.ru/kkm-trade/atolpossystem/v4/any/sell/',
            data: check,
            headers: {
                token: token,
                'Content-Type': 'application/json'
            }

        };
        return await axios(axConf)
            .then((response)=>{
                return response.data.uuid;
            })
            .catch((err)=>{
                console.log(err);
                return null;
            });

    },
    getStatus: async function(token, id){

        let axConf = {
            method: 'get',
            baseURL: 'https://umka365.ru/kkm-trade/atolpossystem/v4/any/report/'+id,
            params: {
                'token': token
            }

        };
        return await axios(axConf)
            .then((response)=>{
                return response.data;
            })
            .catch((err)=>{
                console.log(err);
                return null;
            });


    },
    getTimeStamp: function () {
        let date = new Date();
        let timeStamp = '';
        let year = Number(date.getFullYear().toString().slice(-2));
        let mounth = Number((date.getMonth()+1));
        let day = Number(date.getDate());
        let hour = Number(date.getHours());
        let min =Number(date.getMinutes());
        let sec = Number(date.getSeconds());
        if(day < 10){day = '0'+day};
        if(mounth < 10){mounth = '0'+mounth};
        timeStamp = day+'.'+mounth+'.'+year+' '+hour+':'+min+':'+sec; //"24.04.19 23:48:00"
        return timeStamp;

    },
    prepareData: function(inn, name, sum, extId, timeStamp, payType, email, snType){
        let data = {

            "external_id":"",
            "receipt":{
                "client":{
                    "email":"kkt@kkt.ru"
                },
                "company":{
                    "email":"chek@ivend.ru",
                    "sno":"usn_income",
                    "inn":"7805714120",
                    "payment_address":""
                },
                "items":[
                    {
                        "name":"Кофе 0.2",
                        "price":5.23,
                        "quantity":1.0,
                        "sum":1.23,
                        "measurement_unit":"шт",
                        "payment_method":"full_payment",
                        "payment_object":"commodity",
                        "vat":{
                            "type":"none",
                            "sum":0
                        }
                    }
                ],
                "payments":[
                    {
                        "type":1,
                        "sum":1.23
                    }
                ],

                "total":1.23
            },
            "service":{
                "callback_url":""
            },
            "timestamp":"24.04.19 23:48:00"
        };

        data.external_id = extId;
        data.receipt.company.inn = inn;
        data.receipt.company.email = email;
        if(snType){
            data.receipt.company.sno = snType;
        }
        else{
            data.receipt.company.sno = 'usn_income';
        };
        data.receipt.items[0].name = name;
        data.receipt.items[0].price = sum;
        data.receipt.items[0].sum = sum;
        data.receipt.items[0].quantity = 1;
        data.receipt.payments.type = payType;
        data.receipt.payments.sum = sum;
        data.receipt.total = sum;

        // Обработка налогов, но пока неоткуда взять данные


        return JSON.stringify(data);





    },
    getFiscalString: function (payload){
        let t_arr = payload.receipt_datetime.split(" ");
        let t_date = t_arr[0].split('.');
        t_date = t_date.reverse();
        t_date = ""+t_date[0]+t_date[1]+t_date[2];
        let t_time = t_arr[1].split(':');
        t_time = ""+t_time[0]+t_time[1];
        let t = t_date + "T" + t_time;
        let s = String(payload.total)+".00";
        let fn = payload.fn_number;
        let i = payload.fiscal_document_number;
        let fp = payload.fiscal_document_attribute;
        let n = 1; //Тип системы налогооблажения пока неоткуда взять

        return 't='+t+'&s='+s+'&fn='+fn+'&i='+i+'&fp='+fp+'&n='+n;




    }

};