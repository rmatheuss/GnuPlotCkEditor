const request = require('supertest');

const app = require('../../src/app');

describe('Plotagem', () => {
    it('retorna um JSON com informações do gráfico plotado, uma vez que sejam passados parâmetros válidos de função e intervalo de X', 
    async () => {
        const param = 
            {
                "pKey": '',
                "pX": `[2:10]`, 
                "pTitle": "Teste - Cenário 1",
                "pFunctions": "sin(x), 1/x",
            };

        const response = await request(app)
        .post('/plotGraph')
        .send(param)
        .set('Accept', 'application/json');

        expect(response.status).toBe(200);
    });

    it('retorna um JSON com informações de erro, uma vez que sejam passados parâmetros inválidos de função e válidos de intervalo de X', 
    async () => {
        const param = 
            {
                "pKey": '',
                "pX": '[2:10]', 
                "pTitle": "Teste - Cenário 2",
                "pFunctions": "$$",
            };

        const response = await request(app)
        .post('/plotGraph')
        .send(param)
        .set('Accept', 'application/json');

        expect(response.status).toBe(500);
    });

    it('retorna um JSON com informações de erro, uma vez que sejam passados parâmetros válidos de função e inválidos de intervalo de X', 
    async () => {
        const param = 
            {
                "pKey": '',
                "pX": '$$', 
                "pTitle": "Teste - Cenário 3",
                "pFunctions": "sin(x), 1/x",
            };

        const response = await request(app)
        .post('/plotGraph')
        .send(param)
        .set('Accept', 'application/json');

        expect(response.status).toBe(500);
    });

    it('retorna um JSON com informações de erro, uma vez que sejam passados parâmetros válidos de função e inválidos de intervalo de X', 
    async () => {
        const param = 
            {
                "pKey": '',
                "pX": '$$', 
                "pTitle": "Teste - Cenário 4",
                "pFunctions": "$$",
            };

        const response = await request(app)
        .post('/plotGraph')
        .send(param)
        .set('Accept', 'application/json');

        expect(response.status).toBe(500);
    });

    it('retorna um JSON com informações de erro, uma vez que não sejam passados parâmetros função e intervalo de X', 
    async () => {
        const param = 
            {
                "pKey": '',
                "pTitle": "Teste - Cenário 5",
            };

        const response = await request(app)
        .post('/plotGraph')
        .send(param)
        .set('Accept', 'application/json');

        expect(response.status).toBe(500);
    });


    it('retorna um JSON com informações do gráfico editado, uma vez que seja passado como parâmetro uma chave de gráfico já plotado anteriormente', 
    async () => {
        const param = 
            {
                "pKey": 'dcf99a027f870274c13d777a7b703ab8',
                "pX": `[2:10]`, 
                "pTitle": "Teste - Cenário 6",
                "pFunctions": "sin(x), 1/x",
            };

        const response = await request(app)
        .post('/plotGraph')
        .send(param)
        .set('Accept', 'application/json');

        expect(response.status).toBe(200);
    });
})