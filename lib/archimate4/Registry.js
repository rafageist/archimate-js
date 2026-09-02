const Archimate4Registry = (function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    root.Archimate4Registry = api;
    return api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const VERSION = "4.0-foundation";
    const DOMAIN_COLORS = Object.freeze({
        Motivation: "#CCCCFF",
        Strategy: "#F5DEAA",
        Business: "#FFFFB5",
        Application: "#B5FFFF",
        Technology: "#C9E7B7",
        Implementation: "#FFE0E0",
        Common: "#E8E8E8",
    });

    const AVAILABLE_RENDERER_NOTATIONS = new Set([
        "PICTO_STAKEHOLDER", "PICTO_DRIVER", "PICTO_ASSESSMENT", "PICTO_GOAL",
        "PICTO_OUTCOME", "PICTO_PRINCIPLE", "PICTO_REQUIREMENT", "PICTO_MEANING",
        "PICTO_VALUE",
        "PICTO_ACTOR", "PICTO_ROLE", "PICTO_PRODUCT", "PICTO_COMPONENT",
        "PICTO_COLLABORATION", "PICTO_EVENT", "PICTO_FUNCTION", "PICTO_PROCESS",
        "PICTO_INTERFACE", "PICTO_SERVICE", "PICTO_OBJECT", "PICTO_CAPABILITY",
        "PICTO_RESOURCE", "PICTO_VALUE_STREAM", "PICTO_COURSE_OF_ACTION",
        "PICTO_ARTIFACT", "PICTO_NODE", "PICTO_SYSTEM_SOFTWARE", "PICTO_PATH",
        "PICTO_COMMUNICATION_NETWORK", "PICTO_DEVICE",
        "PICTO_EQUIPMENT", "PICTO_FACILITY", "PICTO_DISTRIBUTION_NETWORK",
        "PICTO_MATERIAL", "PICTO_WORK_PACKAGE", "PICTO_DELIVERABLE", "PICTO_PLATEAU",
        "PICTO_LOCATION", "PICTO_GROUPING",
    ]);
    const AVAILABLE_PALETTE_ASSETS = new Set([
        "motivation_stakeholder", "motivation_driver", "motivation_assessment",
        "motivation_goal", "motivation_outcome", "motivation_principle",
        "motivation_requirement", "motivation_meaning", "motivation_value",
        "strategy_resource", "strategy_capability", "strategy_value_stream",
        "strategy_course_of_action", "business_actor", "business_role",
        "business_collaboration", "business_interface", "business_object",
        "business_product", "business_service", "business_process", "business_function",
        "business_event", "application_component", "application_interface",
        "application_data_object", "technology_node", "technology_device",
        "technology_system_software", "technology_interface",
        "technology_communication_network", "technology_artifact", "technology_path",
        "physical_equipment", "physical_facility", "physical_distribution_network",
        "physical_material", "implementation_work_package", "implementation_deliverable",
        "implementation_plateau", "other_location", "other_grouping",
    ]);

    function notation(ref, asset) {
        const rendererAvailable = AVAILABLE_RENDERER_NOTATIONS.has(ref);
        const paletteAvailable = AVAILABLE_PALETTE_ASSETS.has(asset);
        return Object.freeze({
            ref,
            rendererRef: ref,
            paletteAsset: `assets/icons/${asset}.svg`,
            rendererAvailable,
            paletteAvailable,
            status: rendererAvailable && paletteAvailable ? "complete" : "missing-visual",
            textualFallback: false,
        });
    }

    function concept(id, displayName, domain, category, ref, asset, extra) {
        return Object.freeze({
            id,
            displayName,
            kind: "element",
            domain,
            category,
            notation: notation(ref, asset),
            visual: Object.freeze({ fill: DOMAIN_COLORS[domain], stroke: "#000000" }),
            relationships: Object.freeze({ ruleSource: "archimate4-central-rules" }),
            specialization: Object.freeze({ allowed: true, baseConcept: id }),
            ...(extra || {}),
        });
    }

    const CONCEPTS = Object.freeze([
        concept("Stakeholder", "Stakeholder", "Motivation", "active-structure", "PICTO_STAKEHOLDER", "motivation_stakeholder"),
        concept("Driver", "Driver", "Motivation", "motivation", "PICTO_DRIVER", "motivation_driver"),
        concept("Assessment", "Assessment", "Motivation", "motivation", "PICTO_ASSESSMENT", "motivation_assessment"),
        concept("Goal", "Goal", "Motivation", "motivation", "PICTO_GOAL", "motivation_goal"),
        concept("Outcome", "Outcome", "Motivation", "motivation", "PICTO_OUTCOME", "motivation_outcome"),
        concept("Principle", "Principle", "Motivation", "motivation", "PICTO_PRINCIPLE", "motivation_principle"),
        concept("Requirement", "Requirement", "Motivation", "motivation", "PICTO_REQUIREMENT", "motivation_requirement"),
        concept("Meaning", "Meaning", "Motivation", "passive-structure", "PICTO_MEANING", "motivation_meaning"),
        concept("Value", "Value", "Motivation", "passive-structure", "PICTO_VALUE", "motivation_value"),

        concept("Resource", "Resource", "Strategy", "active-structure", "PICTO_RESOURCE", "strategy_resource"),
        concept("Capability", "Capability", "Strategy", "behavior", "PICTO_CAPABILITY", "strategy_capability"),
        concept("ValueStream", "Value Stream", "Strategy", "behavior", "PICTO_VALUE_STREAM", "strategy_value_stream"),
        concept("CourseOfAction", "Course of Action", "Strategy", "behavior", "PICTO_COURSE_OF_ACTION", "strategy_course_of_action"),

        concept("BusinessActor", "Business Actor", "Business", "active-structure", "PICTO_ACTOR", "business_actor"),
        concept("BusinessInterface", "Business Interface", "Business", "active-structure", "PICTO_INTERFACE", "business_interface"),
        concept("BusinessObject", "Business Object", "Business", "passive-structure", "PICTO_OBJECT", "business_object"),
        concept("Product", "Product", "Business", "passive-structure", "PICTO_PRODUCT", "business_product"),

        concept("ApplicationComponent", "Application Component", "Application", "active-structure", "PICTO_COMPONENT", "application_component"),
        concept("ApplicationInterface", "Application Interface", "Application", "active-structure", "PICTO_INTERFACE", "application_interface"),
        concept("DataObject", "Data Object", "Application", "passive-structure", "PICTO_OBJECT", "application_data_object"),

        concept("Node", "Node", "Technology", "active-structure", "PICTO_NODE", "technology_node"),
        concept("Device", "Device", "Technology", "active-structure", "PICTO_DEVICE", "technology_device"),
        concept("SystemSoftware", "System Software", "Technology", "active-structure", "PICTO_SYSTEM_SOFTWARE", "technology_system_software"),
        concept("TechnologyInterface", "Technology Interface", "Technology", "active-structure", "PICTO_INTERFACE", "technology_interface"),
        concept("CommunicationNetwork", "Communication Network", "Technology", "active-structure", "PICTO_COMMUNICATION_NETWORK", "technology_communication_network"),
        concept("Artifact", "Artifact", "Technology", "passive-structure", "PICTO_ARTIFACT", "technology_artifact"),

        concept("Equipment", "Equipment", "Technology", "active-structure", "PICTO_EQUIPMENT", "physical_equipment", { legacyDomain: "Physical" }),
        concept("Facility", "Facility", "Technology", "active-structure", "PICTO_FACILITY", "physical_facility", { legacyDomain: "Physical" }),
        concept("DistributionNetwork", "Distribution Network", "Technology", "active-structure", "PICTO_DISTRIBUTION_NETWORK", "physical_distribution_network", { legacyDomain: "Physical" }),
        concept("Material", "Material", "Technology", "passive-structure", "PICTO_MATERIAL", "physical_material", { legacyDomain: "Physical" }),

        concept("WorkPackage", "Work Package", "Implementation", "behavior", "PICTO_WORK_PACKAGE", "implementation_work_package"),
        concept("Deliverable", "Deliverable", "Implementation", "passive-structure", "PICTO_DELIVERABLE", "implementation_deliverable"),
        concept("Plateau", "Plateau", "Implementation", "passive-structure", "PICTO_PLATEAU", "implementation_plateau"),

        concept("Role", "Role", "Common", "active-structure", "PICTO_ROLE", "business_role", { supportedDomains: Object.freeze(["Business", "Application", "Technology"]) }),
        concept("Collaboration", "Collaboration", "Common", "active-structure", "PICTO_COLLABORATION", "business_collaboration", { supportedDomains: Object.freeze(["Business", "Application", "Technology"]) }),
        concept("Service", "Service", "Common", "behavior", "PICTO_SERVICE", "business_service", { supportedDomains: Object.freeze(["Business", "Application", "Technology"]) }),
        concept("Process", "Process", "Common", "behavior", "PICTO_PROCESS", "business_process", { supportedDomains: Object.freeze(["Business", "Application", "Technology"]) }),
        concept("Function", "Function", "Common", "behavior", "PICTO_FUNCTION", "business_function", { supportedDomains: Object.freeze(["Business", "Application", "Technology"]) }),
        concept("Event", "Event", "Common", "behavior", "PICTO_EVENT", "business_event", { supportedDomains: Object.freeze(["Business", "Application", "Technology", "Implementation"]) }),
        concept("Path", "Path", "Common", "active-structure", "PICTO_PATH", "technology_path"),
        concept("Location", "Location", "Common", "other", "PICTO_LOCATION", "other_location"),
        concept("Grouping", "Grouping", "Common", "other", "PICTO_GROUPING", "other_grouping"),
    ]);

    const CONCEPT_BY_ID = new Map(CONCEPTS.map((entry) => [entry.id, entry]));

    function relationship(id, category, notationRef, properties) {
        return Object.freeze({
            id,
            displayName: id,
            kind: "relationship",
            category,
            notation: Object.freeze({ ref: notationRef, textualFallback: false }),
            rules: Object.freeze({
                source: "archimate4-central-rules",
                status: "requires-normative-matrix",
                defaultDecision: "deny",
            }),
            properties: Object.freeze(properties || {}),
        });
    }

    const RELATIONSHIPS = Object.freeze([
        relationship("Composition", "structural", "RELATION_COMPOSITION"),
        relationship("Aggregation", "structural", "RELATION_AGGREGATION"),
        relationship("Assignment", "structural", "RELATION_ASSIGNMENT"),
        relationship("Realization", "structural", "RELATION_REALIZATION"),
        relationship("Serving", "dependency", "RELATION_SERVING"),
        relationship("Access", "dependency", "RELATION_ACCESS", { accessMode: ["read", "write", "read-write"] }),
        relationship("Influence", "dependency", "RELATION_INFLUENCE", { strength: true }),
        relationship("Association", "other", "RELATION_ASSOCIATION", { directed: true }),
        relationship("Triggering", "dynamic", "RELATION_TRIGGERING"),
        relationship("Flow", "dynamic", "RELATION_FLOW", { label: true }),
        relationship("Specialization", "other", "RELATION_SPECIALIZATION"),
    ]);
    const RELATIONSHIP_BY_ID = new Map(RELATIONSHIPS.map((entry) => [entry.id, entry]));

    const JUNCTIONS = Object.freeze([
        Object.freeze({ id: "AndJunction", displayName: "AND Junction", kind: "junction", notation: Object.freeze({ ref: "JUNCTION_AND", textualFallback: false }), rules: Object.freeze({ source: "archimate4-central-rules" }) }),
        Object.freeze({ id: "OrJunction", displayName: "OR Junction", kind: "junction", notation: Object.freeze({ ref: "JUNCTION_OR", textualFallback: false }), rules: Object.freeze({ source: "archimate4-central-rules" }) }),
    ]);

    const REMOVED_NATIVE_CONCEPTS = Object.freeze([
        "BusinessInteraction", "ApplicationInteraction", "TechnologyInteraction",
        "Constraint", "Contract", "Gap", "Representation",
        "BusinessRole", "BusinessCollaboration", "ApplicationCollaboration",
        "TechnologyCollaboration", "BusinessService", "ApplicationService",
        "TechnologyService", "BusinessProcess", "ApplicationProcess",
        "TechnologyProcess", "BusinessFunction", "ApplicationFunction",
        "TechnologyFunction", "BusinessEvent", "ApplicationEvent",
        "TechnologyEvent", "ImplementationEvent",
    ]);

    const LEGACY_MAPPINGS = Object.freeze({
        BusinessRole: { target: "Role", mode: "rename" },
        BusinessCollaboration: { target: "Collaboration", mode: "merge", specialization: "Business Collaboration" },
        ApplicationCollaboration: { target: "Collaboration", mode: "merge", specialization: "Application Collaboration" },
        TechnologyCollaboration: { target: "Collaboration", mode: "merge", specialization: "Technology Collaboration" },
        BusinessService: { target: "Service", mode: "merge", specialization: "Business Service" },
        ApplicationService: { target: "Service", mode: "merge", specialization: "Application Service" },
        TechnologyService: { target: "Service", mode: "merge", specialization: "Technology Service" },
        BusinessProcess: { target: "Process", mode: "merge", specialization: "Business Process" },
        ApplicationProcess: { target: "Process", mode: "merge", specialization: "Application Process" },
        TechnologyProcess: { target: "Process", mode: "merge", specialization: "Technology Process" },
        BusinessFunction: { target: "Function", mode: "merge", specialization: "Business Function" },
        ApplicationFunction: { target: "Function", mode: "merge", specialization: "Application Function" },
        TechnologyFunction: { target: "Function", mode: "merge", specialization: "Technology Function" },
        BusinessEvent: { target: "Event", mode: "merge", specialization: "Business Event" },
        ApplicationEvent: { target: "Event", mode: "merge", specialization: "Application Event" },
        TechnologyEvent: { target: "Event", mode: "merge", specialization: "Technology Event" },
        ImplementationEvent: { target: "Event", mode: "merge", specialization: "Implementation Event" },
        Constraint: { target: "Requirement", mode: "specialization", specialization: "Constraint" },
        Contract: { target: "BusinessObject", mode: "specialization", specialization: "Contract" },
        BusinessInteraction: { target: "Function", mode: "interpretation", specialization: "Business Interaction", reviewRequired: true },
        ApplicationInteraction: { target: "Function", mode: "interpretation", specialization: "Application Interaction", reviewRequired: true },
        TechnologyInteraction: { target: "Function", mode: "interpretation", specialization: "Technology Interaction", reviewRequired: true },
        Gap: { choices: ["Assessment", "Deliverable"], mode: "interpretation", reviewRequired: true },
        Representation: { choices: ["DataObject", "Artifact", "Material"], mode: "interpretation", reviewRequired: true },
    });

    function getConcept(id) {
        return CONCEPT_BY_ID.get(id) || null;
    }

    function getPaletteConcepts() {
        return CONCEPTS.filter((entry) => entry.notation.status === "complete");
    }

    function resolveNotation(id) {
        const entry = getConcept(id);
        return entry ? entry.notation : null;
    }

    function validateSpecialization(definition) {
        const base = getConcept(definition && definition.baseConcept);
        return Boolean(base && definition.name && base.specialization.allowed);
    }

    function defineViewpoint(definition) {
        const allowed = new Set(definition.concepts || []);
        const unknown = [...allowed].filter((id) => !CONCEPT_BY_ID.has(id));
        if (unknown.length) throw new Error(`Unknown viewpoint concepts: ${unknown.join(", ")}`);
        return Object.freeze({
            id: definition.id,
            name: definition.name,
            purpose: definition.purpose || "designing",
            concepts: Object.freeze([...allowed]),
        });
    }

    function canConnect(sourceId, relationshipId, targetId, ruleMatrix) {
        if (!CONCEPT_BY_ID.has(sourceId) || !CONCEPT_BY_ID.has(targetId)) return false;
        if (!RELATIONSHIP_BY_ID.has(relationshipId)) return false;
        if (!ruleMatrix) return false;
        return Boolean(ruleMatrix[`${sourceId}|${relationshipId}|${targetId}`]);
    }

    function analyzeLegacyXml(xml) {
        const transformations = [];
        const manualReview = [];
        const seen = new Set();
        const expression = /xsi:type=["'](?:archimate:)?([^"']+)["']/g;
        let match;
        while ((match = expression.exec(String(xml || "")))) {
            const type = match[1].replace(/Relationship$/, "");
            const mapping = LEGACY_MAPPINGS[type];
            if (!mapping || seen.has(type)) continue;
            seen.add(type);
            const item = Object.freeze({ legacyType: type, ...mapping });
            (mapping.reviewRequired ? manualReview : transformations).push(item);
        }
        return Object.freeze({
            sourceVersion: /archimate\/3\./.test(String(xml || "")) ? "3.x" : "unknown",
            transformations: Object.freeze(transformations),
            manualReview: Object.freeze(manualReview),
            safeToAutoMigrate: manualReview.length === 0,
        });
    }

    return Object.freeze({
        VERSION,
        domains: Object.freeze(Object.keys(DOMAIN_COLORS)),
        concepts: CONCEPTS,
        relationships: RELATIONSHIPS,
        junctions: JUNCTIONS,
        removedNativeConcepts: REMOVED_NATIVE_CONCEPTS,
        legacyMappings: LEGACY_MAPPINGS,
        getConcept,
        getPaletteConcepts,
        resolveNotation,
        validateSpecialization,
        defineViewpoint,
        canConnect,
        analyzeLegacyXml,
    });
});

export default Archimate4Registry;
