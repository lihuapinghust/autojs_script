const translations = {
    "NEXT": {
        "ES": "SIGUIENTE",
        "ID": "SELANJUTNYA"
    },
    "TRY ANOTHER WAY": {
        "ES": "PRUEBA OTRA MANERA",
        "ID": "COBA CARA LAIN"
    },
    "Add phone number?": {
        "ES": "¿Agregar número de teléfono?",
        "ID": "Tambah nomor telepon?"
    },
    "Skip": {
        "ES": "Omitir",
        "ID": "LEWATI"
    },
    "I agree": {
        "ES": "Estoy de acuerdo",
        "ID": "SAYA SETUJU"
    },
    "ACCEPT": {
        "ES": "ACEPTAR",
        "ID": "LAINNYA"
    },
    "AGREE": {
        "ES": "ACEPTAR",
        "ID": "SETUJU"
    }
    // 添加更多翻译...
};

function translate(message, country) {
    if (country == null || country == "") {
        country = "US";
    }
    if (translations[message] && translations[message][country]) {
        return translations[message][country];
    }
    return message; // 如果没有找到翻译，则返回原始消息
}

module.exports = translate;
