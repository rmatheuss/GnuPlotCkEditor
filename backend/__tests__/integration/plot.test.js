const request = require('supertest');

const app = require('../../src/app');

describe('Plotagem', () => {
    it('retorna um JSON com informações do gráfico plotado, uma vez que sejam passados parâmetros válidos', 
    async () => {
        const param = 
            {
                "pKey": '',
                "pX": `[2:10]`, 
                "pTitle": "Teste Criar",
                "pFunctions": "sin(x), 1/x",
            };

        const response = await request(app)
        .post('/plotGraph')
        .send(param)
        .set('Accept', 'application/json');

        expect(response.status).toBe(200);
    });


    it('retorna um JSON com informações do gráfico editado, uma vez que seja passado como parâmetro uma chave de um gráfico já existente', 
    async () => {
        const param = 
            {
                "pKey": 'dcf99a027f870274c13d777a7b703ab8',
                "pX": `[2:10]`, 
                "pTitle": "Teste Editar",
                "pFunctions": "sin(x), 1/x",
            };

        const response = await request(app)
        .post('/plotGraph')
        .send(param)
        .set('Accept', 'application/json');

        expect(response.status).toBe(200);
    });
})