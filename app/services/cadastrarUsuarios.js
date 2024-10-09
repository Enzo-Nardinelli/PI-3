export async function cadastarUsuario(dadosDoUsuario){
    const response = await fetch("https://8082-idx-novoprojeto-1726190126082.cluster-qhrn7lb3szcfcud6uanedbkjnm.cloudworkstations.dev/",{
        method: 'POST',
            headers: {'Content-type' : 'application/json',
                       'Cookie': 'WorkstationJwtPartitioned=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2Nsb3VkLmdvb2dsZS5jb20vd29ya3N0YXRpb25zIiwiYXVkIjoiaWR4LW5vdm9wcm9qZXRvLTE3MjYxOTAxMjYwODIuY2x1c3Rlci1xaHJuN2xiM3N6Y2ZjdWQ2dWFuZWRia2pubS5jbG91ZHdvcmtzdGF0aW9ucy5kZXYiLCJpYXQiOjE3MjczOTcxOTYsImV4cCI6MTcyNzQwMDc5NX0.0GdFH_HpILU7SH12hJ1YFTWU1hF5G_mEKMmLILT4PYM91BLlCgQcitBWfMg2wWoz23p32EWdoBNtzzrEu43GosfG88bEuEIMRu0MpGynPsUVYs1xbjMMTBoqZZD6K3mOxfPGmblVAY0hCKN2gbI_c0XkPwRS5ViRrqMdTBMsl9c4Ni5oAC-PyWtaFi9O2ixFlnPaEi-YXb5rTnEBDJRk3Cjt5a4rJJ-iMDOFAaErUIdZHiyPTtoM5NmtT2eHuXNQzDY6WhqvFGRTs4l4NAqVF51kK08fVW_B4ox1MSfTHr0lyTeuTwnygCUiDpdnkWHMOcrk7FpZ-jE8UQIHdMV0_g' },
            body: JSON.stringify(dadosDoUsuario)
            
    });

    if(!response.ok){
        console.log("Falha na requisição");
    } 

    return response.json();
} 