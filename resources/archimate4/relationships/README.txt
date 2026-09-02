ArchiMate 4 Relationship Matrix - CSV package
Generated: 2026-09-02

FILES
- archimate4_relationship_matrix.csv
  42 x 42 matrix. Rows are source concepts, columns are target concepts.
  Each cell contains allowed relationship names separated by '|'.

- archimate4_relationship_matrix_codes.csv
  Same 42 x 42 matrix using compact codes:
    C Composition
    G Aggregation
    I Assignment
    R Realization
    V Serving
    A Access
    N Influence
    O Association
    S Specialization
    F Flow
    T Triggering

  IMPORTANT: these compact codes are product convenience codes. They do NOT
  encode the Appendix B.5 uppercase/lowercase distinction between direct and
  derived relationships.

- archimate4_relationships_normalized.csv
  One row per allowed source/target/relationship triple. This is the most
  convenient form for importing into a rules engine or generating tests.

SCOPE
- 42 native ArchiMate 4 elements.
- AND/OR junctions are intentionally not rows/columns in this element matrix;
  junction semantics should be handled separately by the relationship engine.

BASIS
- The Open Group ArchiMate 4 Specification, Appendix B.5/B.6, is the normative
  reference for allowed relationships.
- For machine-readable extraction/expansion, the matrix was generated from the
  public ArchiMate 4 ontology/rule representation in:
  https://github.com/mbauer83/architectonic
  src/ontologies/archimate_4/connections.yaml
  src/ontologies/archimate_4/entities.yaml

VALIDATION NOTE
- The generated allowed-set matrix was cross-checked against representative
  cells and structural rules visible in Appendix B.5/B.6.
- The official B.5 tables also distinguish DIRECT relationships (uppercase)
  from DERIVED relationships (lowercase). That direct/derived classification
  is deliberately not invented here because the public machine-readable source
  used for generation represents the allowed set, not the case distinction.
  If the runtime needs direct-vs-derived provenance, add it as a separate
  normative dataset rather than inferring it from these CSVs.
