#include <node_api.h>
#include <sstream>
#include <iostream>

std::string convertBase(const std::string& number, int fromBase, int toBase) {
    // Преобразование строки в число с заданной системой счисления
    long long decimalNumber = std::stoll(number, nullptr, fromBase);

    // Проверка валидности целевой системы счисления
    if (toBase < 2 || toBase > 36) {
        return "Invalid target base";
    }

    // Преобразование числа в целевую систему счисления
    std::stringstream resultStream;
    while (decimalNumber > 0) {
        int remainder = decimalNumber % toBase;
        char digit = (remainder > 9) ? (remainder - 10 + 'A') : (remainder + '0');
        resultStream << digit;
        decimalNumber /= toBase;
    }

    std::string result = resultStream.str();
    std::reverse(result.begin(), result.end());  // Инвертируем строку

    return result.empty() ? "0" : result;
}

napi_value ConvertBase(napi_env env, napi_callback_info info) {
    size_t argc = 3;
    napi_value args[3];
    napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);

    if (argc < 3) {
        napi_throw_error(env, nullptr, "Недостаточно аргументов");
        return nullptr;
    }

    char number[256];
    int fromBase, toBase;
    napi_get_value_string_utf8(env, args[0], number, sizeof(number), nullptr);
    napi_get_value_int32(env, args[1], &fromBase);
    napi_get_value_int32(env, args[2], &toBase);

    std::string result = convertBase(number, fromBase, toBase);

    napi_value resultString;
    napi_create_string_utf8(env, result.c_str(), NAPI_AUTO_LENGTH, &resultString);

    return resultString;
}

napi_value Init(napi_env env, napi_value exports) {
    napi_property_descriptor desc = { "convertBase", nullptr, ConvertBase, nullptr, nullptr, nullptr, napi_default, nullptr };
    napi_define_properties(env, exports, 1, &desc);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)