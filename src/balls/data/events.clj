(ns balls.data.events)

(defn- add-red-alert [{:keys [sick] :as grouped-pipelines}]
  (let [over-threshold (> (count sick) 3)]
    (assoc grouped-pipelines :red-alert over-threshold)))

(defn add-ui-events [grouped-pipelines]
  (add-red-alert grouped-pipelines))
