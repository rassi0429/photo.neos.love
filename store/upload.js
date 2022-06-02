export const state = () => ({
    isUploadModal: false
})

export const getters = {
}

export const actions = {
}

export const mutations = {
    openModal(state, data) {
        state.isUploadModal = true
    },
    closeModal(state) {
        state.isUploadModal = false
    }
}
