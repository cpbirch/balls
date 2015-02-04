(ns balls.views.index
  (:require [balls.views.layout :refer [view-layout]]
            [balls.config :refer [config]])
  (:use [hiccup.core]))

(def title "Balls!!")

(defn- config-section [{:keys [cctray-url include exclude]}]
  [:div {:id "config-interface"}
   [:input {:type "text" :placeholder "cc-tray url" :id "ci-url-text" :value cctray-url}]
   [:input {:type "button" :id "ci-url-fetch-btn" :value "fetch"}]

   [:input {:type "text" :id "filter-field" :placeholder "filter projects." :value include}]
   [:input {:type "text" :id "exclude-field" :placeholder "exclude projects." :value exclude}]

   [:div {:id "selected-pipelines"}]

   [:input {:type "button" :id "settings-reset-btn" :value "reset"}]
   [:input {:type "button" :id "settings-save-btn" :value "save"}]
   [:input {:type "button" :id "settings-close-btn" :value "close"}]])

(defn- preferences-section []
  [:div {:id "preferences"}
   [:input {:type "checkbox" :id "play-broken-build-sound" :checked "checked"}]
   [:label "play sound when build breaks"]

   [:br]

   [:input {:type "checkbox" :id "rotate-non-green-text" :checked "checked"}]
   [:label "rotate non-green pipeline names"]

   [:br]

   [:label "repulsion"]
   [:input {:type "range" :id "repulsion-factor" :min "1" :max "10" :value "1" :step "1"}]

   [:br]

   [:label "attraction"]
   [:input {:type "range" :id "attraction-factor" :min "1" :max "100" :value "1" :step "1"}]])

(defn- audio-section []
  [:audio {:id "build-breaking-audio" :src "/sounds/wario_ah_hahaha_wonderful.wav"}])

(defn contents []
  (let [c (config)]

    (view-layout title
                 [:div {:id "interface"}
                  [:button {:id "config"} "config"]]

                 (config-section c)

                 [:div {:id "preferences-control"}
                  [:button {:id "preferences-control-btn"} "controls"]]

                 [:div {:id "container"}]

                 (preferences-section)

                 (audio-section)

                 [:script {:data-main "/scripts/app" :src "/scripts/lib/require.js"}])))


