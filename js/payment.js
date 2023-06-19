const button = document.querySelector('#download')
async function generatePayment(){
    try {
        const token = localStorage.getItem( 'token' )
        const inn = document.querySelector('#inn').value
        const address = document.querySelector('#address').value
        const number = document.querySelector('#number').value
        const email = document.querySelector('#email').value
        const orderTitle = document.querySelector('#orderTitle').value
        const name = document.querySelector('#name').value
        const orderId = document.querySelector('#orderId').value
        const amount = document.querySelector('#amount').value
        const payCourseId = localStorage.getItem('payCourseId')
        const response = await axios.post( 'https://ntgspi.devsnowflake.ru/api/documents/invoice_payment', {
                inn,
                address,
                number,
                email,
                orderTitle,
                payCourseId,
                name,
                orderId,
                amount:amount*100
            },
            {
                responseType:'blob', // надо проверить
                headers:     {
                    'access':token
                }
            } )
        const response2 = await axios.post( 'https://ntgspi.devsnowflake.ru/api/documents/final', {},
            {
                responseType:'blob', // надо проверить
            } )
        await downloadFiles(response.data,'Счет на оплату','application/pdf')
        await downloadFiles(response2.data,'Диплом','application/pdf')
        
    }
    catch ( e ) {
        console.log( e )
    }
}

button.onclick = async function a () {
    await generatePayment()
}
async function getUserData(){
    try {
        const token = localStorage.getItem( 'token' )
        const response = await axios.get( 'https://ntgspi.devsnowflake.ru/api/user/getUserData', {
            headers:{
                'access':token
            }
        } )
        const name = document.querySelector('#name')

        const orderId = document.querySelector('#orderId')

        const amount = document.querySelector('#amount')


        const amountA = localStorage.getItem('amount')
        const paymentNumber = localStorage.getItem('paymentNumber')

        name.value = response.data.message.lastName + ' ' +response.data.message.name  + ' ' + response.data.message.middleName
        amount.value = amountA
        orderId.value = paymentNumber

    }
    catch ( e ) {
        console.log(e)
    }
}
getUserData()


async function downloadFiles(data, filename, type) {
    const blob = new Blob([ data ], { type: type || 'application/octet-stream' });
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE doesn't allow using a blob object directly as link href.
        // Workaround for "HTML7007: One or more blob URLs were
        // revoked by closing the blob for which they were created.
        // These URLs will no longer resolve as the data backing
        // the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
        return;
    }

    const urlData = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = urlData;
    link.setAttribute('download', filename);

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof link.download === 'undefined') {
        link.setAttribute('target', '_blank');
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(urlData);
    }, 100);
}
