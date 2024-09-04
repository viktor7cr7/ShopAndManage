import { authCookieAndNewContext } from "./authCookieAndNewContext"
import { AddProductPage } from "../pages/adminPage/addProductPage"

export const createProduct = async () => {
    const page = await authCookieAndNewContext()

    const addProductPage = new AddProductPage(page)
    await addProductPage.navigate()
    await page.waitForURL(/dashboard\/admin\/add-product/)

    const valueName = '6.6" Смартфон Samsung Galaxy A55 5G 256 ГБ Синий'
    const valueDescription = 'Смартфон Samsung Galaxy A55 5G 256 ГБ в синем корпусе оснащен дисплеем 6.6” с защитным покрытием Corning Gorilla Glass Victus+ от царапин. Матрица Super AMOLED сохраняет яркость и четкость изображений при любом освещении. Разрешение 2340x1080 dpi с плотностью пикселей 388 ppi устраняет эффект зернистости.Samsung Galaxy A55 5G поддерживает работу с 1 электронной и 2 физическими SIM-картами. Вы можете использовать универсальный слот для установки microSD объемом до 1 ТБ. 8-ядерный процессор Samsung Exynos 1480 с ОЗУ 8 ГБ не дает приложениям зависать, а графике тормозить. 256 ГБ памяти хватает для установки нужного софта и хранения файлов. Встроенный в экран сканер отпечатков пальцев и функция распознавания лиц создают дополнительный уровень защиты личных данных.'
    const valueQuantity = '100'
    const pathImg = '/api-market/tests/testData/imgUserPanel/bonfire.png' 
    const valueCategory = 'Электроника'
    const valuePrice = '160000'
    const btnSubmit = addProductPage.getBtnSubmit()

    await addProductPage.getInputName().fill(valueName)
    await addProductPage.getInputDescription().fill(valueDescription)
    await addProductPage.getInputQuantity().fill(valueQuantity)
    await addProductPage.getDownloadImgProduct().setInputFiles(pathImg)
    await addProductPage.getSelectCategory().selectOption({label: valueCategory})
    await addProductPage.getInputPrice().fill(valuePrice)
    await btnSubmit.click()
    return {page: page, valueName: valueName}
}