const table = document.querySelector('#table')

async function getcourses(){
    try{
        const token = localStorage.getItem('token')
        const response = await axios.get( 'https://ntgspi.devsnowflake.ru/api/user/myCourse/reg', {
            headers:{
                'access':token
            }
        } )
        for ( const item of response.data.message ) {
            const statuses = {
                1:'В обработке',
                2:'Подтверждена',
                3:'Отклонена'
            }
            table.innerHTML += `
          <tbody>
            <tr>
              <td>${item.id}</td>
              <td>${item.coursename}</td>
              <td><strong>${item.courseprice}</strong></td>
              <td>
                <p class="status in-processing">${statuses[item.requestConfirm]}</p>
              </td>
              <td><a class="button__more" style="margin-bottom: 27px" onclick="downloadDoc(${item.courseId})"><span>Скачать</span></a></td>
              <!--<a onclick="setCourse(1)"  ></a>-->
            </tr>
          </tbody>`
        }
    }
    catch ( e ) {
        console.log(e)
        if(e.response.status === 403){
            localStorage.removeItem('token')
            window.close()
            window.open('./auth.html')
        }
    }
}
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

async function downloadDoc(courseId){
    try {
        const token = localStorage.getItem('token')
        const response = await axios.post( 'https://ntgspi.devsnowflake.ru/api/documents/KPKAndPP', {courseId},
            {
                responseType: 'blob', // надо проверить
                headers:{
                    'access':token
                }
            } )
        await downloadFiles(response.data,'Заявление','application/pdf')
        const response2 = await axios.post( 'https://ntgspi.devsnowflake.ru/api/documents/consentPersonalCustomer', {courseId},
            {
                responseType: 'blob', // надо проверить
                headers:{
                    'access':token
                }
            } )
        await downloadFiles(response2.data,'Согласие на обработку персональных данных','application/pdf')
        const response3 = await axios.post( 'https://ntgspi.devsnowflake.ru/api/documents/customer', {courseId},
            {
                responseType: 'blob', // надо проверить
                headers:{
                    'access':token
                }
            } )
        await downloadFiles(response3.data,'Договор','application/pdf')
    }
    catch ( e ) {
        console.log(e)
        if(e.response.status === 403){
            localStorage.removeItem('token')
            window.close()
            window.open('./auth.html')
        }
    }
}

getcourses()
