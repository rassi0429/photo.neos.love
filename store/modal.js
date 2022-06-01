export const state = () => ({
    isModalOpen: false,
    modalData: {}
})

export const actions = {
}

export const mutations = {
    openModal(state, data) {
        state.isModalOpen = true
        state.modalData = data
    },
    closeModal(state) {
        state.isModalOpen = false
        state.modalData = {}
    }
}